using FarmManagement.SharedKernel.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// --- Forwarded Headers (CRITICAL for proxy deployments) ---
// Render and Netlify sit behind load balancers. Without this, RemoteIpAddress is
// always the proxy IP and the rate limiter treats ALL users as a single client.
// Clearing KnownNetworks/KnownProxies means we unconditionally trust X-Forwarded-For,
// which is safe because Render/Netlify control what they send in that header.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // Trust all upstream proxies (Netlify CDN, Render load balancer)
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// --- YARP Reverse Proxy ---
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// --- JWT Authentication ---
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"]
    ?? throw new InvalidOperationException("JWT SecretKey not configured.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "farm-management-auth",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "farm-management-api",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("authenticated", policy => policy.RequireAuthenticatedUser());
});

// --- Rate Limiting ---
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 10
            }));
    options.RejectionStatusCode = 429;
});

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // In production: set FRONTEND_URL env var to your deployed frontend origin
        // e.g. https://your-farm-app.netlify.app
        // Multiple origins can be added as comma-separated values
        var configured = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:3000", "http://localhost:5173" };

        // Also read FRONTEND_URL env var (single production origin)
        var frontendUrl = builder.Configuration["FrontendUrl"];
        var origins = string.IsNullOrEmpty(frontendUrl)
            ? configured
            : configured.Append(frontendUrl).Distinct().ToArray();

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// --- HttpClient for metrics aggregation ---
builder.Services.AddHttpClient("CatalogApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ServiceUrls:CatalogApi"] ?? "http://localhost:5001");
});
builder.Services.AddHttpClient("ProductionApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ServiceUrls:ProductionApi"] ?? "http://localhost:5002");
});

builder.Services.AddHealthChecks();

var app = builder.Build();

// --- Middleware Pipeline ---
// ForwardedHeaders MUST come first — before rate limiter reads RemoteIpAddress
app.UseForwardedHeaders();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRateLimiter();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// --- Metrics Aggregation Endpoint ---
// Fans out to Catalog and Production APIs and aggregates farm metrics
app.MapGet("/api/gateway/metrics", async (HttpContext httpContext, IHttpClientFactory httpClientFactory) =>
{
    // Forward the Authorization header to downstream services
    var authHeader = httpContext.Request.Headers.Authorization.FirstOrDefault();
    if (string.IsNullOrEmpty(authHeader))
    {
        return Results.Unauthorized();
    }

    var catalogClient = httpClientFactory.CreateClient("CatalogApi");
    catalogClient.DefaultRequestHeaders.Add("Authorization", authHeader);

    var productionClient = httpClientFactory.CreateClient("ProductionApi");
    productionClient.DefaultRequestHeaders.Add("Authorization", authHeader);

    try
    {
        // 30-second timeout: Render free-tier containers sleep after 15 min idle and
        // take 30-50s to wake up. A 5s timeout would 504 on every cold start.
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));

        // Fan-out: call both services in parallel
        var catalogTask = catalogClient.GetStringAsync("/api/catalog/livestock/count", cts.Token);
        var productionTask = productionClient.GetStringAsync("/api/production/dairy/summary", cts.Token);

        await Task.WhenAll(catalogTask, productionTask);

        var catalogData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(catalogTask.Result);
        var productionData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(productionTask.Result);

        return Results.Ok(new
        {
            livestock = catalogData,
            dairy = productionData,
            aggregatedAt = DateTime.UtcNow
        });
    }
    catch (OperationCanceledException)
    {
        return Results.Problem(
            title: "Metrics Timeout",
            detail: "One or more downstream services did not respond in time. Please try again.",
            statusCode: 504
        );
    }
    catch (Exception ex)
    {
        // Do not leak internal error details to the client in production
        var detail = app.Environment.IsDevelopment()
            ? ex.Message
            : "An error occurred while aggregating metrics.";
        return Results.Problem(
            title: "Failed to aggregate metrics",
            detail: detail,
            statusCode: 502
        );
    }
}).RequireAuthorization("authenticated");

// --- Health check aggregating downstream services ---
app.MapGet("/health", async (IHttpClientFactory httpClientFactory) =>
{
    var services = new Dictionary<string, string>();

    try
    {
        var catalogClient = httpClientFactory.CreateClient("CatalogApi");
        var catalogResponse = await catalogClient.GetAsync("/health");
        services["catalog-api"] = catalogResponse.IsSuccessStatusCode ? "healthy" : "unhealthy";
    }
    catch { services["catalog-api"] = "unreachable"; }

    try
    {
        var productionClient = httpClientFactory.CreateClient("ProductionApi");
        var productionResponse = await productionClient.GetAsync("/health");
        services["production-api"] = productionResponse.IsSuccessStatusCode ? "healthy" : "unhealthy";
    }
    catch { services["production-api"] = "unreachable"; }

    var overallHealthy = services.Values.All(s => s == "healthy");
    return Results.Ok(new
    {
        status = overallHealthy ? "healthy" : "degraded",
        services,
        checkedAt = DateTime.UtcNow
    });
});

// --- YARP reverse proxy ---
app.MapReverseProxy();

app.Run();
