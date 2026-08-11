using AuthService.Data;
using AuthService.Services;
using AuthService.Repositories;
using FarmManagement.SharedKernel.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Forwarded Headers ---
// Required when deployed on Render (behind a load balancer).
// Ensures request.HttpContext.Connection.RemoteIpAddress reflects the real client IP.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// --- Database ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Auth DB connection string not configured.");
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- Repositories & Services ---
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IGoogleOAuthService, GoogleOAuthService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

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

builder.Services.AddAuthorization();

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // In production: set FRONTEND_URL env var to your deployed frontend origin
        var configured = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:3000", "http://localhost:5173" };

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

// --- Controllers & Swagger ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var app = builder.Build();

// --- Middleware Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ForwardedHeaders MUST come first in the pipeline
app.UseForwardedHeaders();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

// --- Auto-migrate on startup using Evolve ---
try
{
    var evolveConnection = new Npgsql.NpgsqlConnection(connectionString);
    var evolve = new EvolveDb.Evolve(evolveConnection, msg => Console.WriteLine(msg))
    {
        Locations = new[] { "db/migrations" },
        IsEraseDisabled = true,
    };
    evolve.Migrate();
}
catch (Exception ex)
{
    Console.WriteLine("Database migration failed: " + ex.Message);
    throw;
}

app.Run();
