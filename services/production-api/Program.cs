using ProductionApi.Data;
using ProductionApi.Repositories;
using ProductionApi.Services;
using FarmManagement.SharedKernel.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Database ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Production DB connection string not configured.");
builder.Services.AddDbContext<ProductionDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- HttpContext for tenant extraction ---
builder.Services.AddHttpContextAccessor();

// --- Services & Repositories ---
builder.Services.AddScoped<IDairyRepository, DairyRepository>();
builder.Services.AddScoped<IDairyService, DairyService>();
builder.Services.AddScoped<IFeedConsumptionRepository, FeedConsumptionRepository>();
builder.Services.AddScoped<IFeedConsumptionService, FeedConsumptionService>();
builder.Services.AddSingleton<IDateTimeService, DateTimeService>();

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

// CORS is handled at the API Gateway level to prevent duplicate header errors.

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

app.UseMiddleware<FarmManagement.SharedKernel.Middleware.ExceptionHandlingMiddleware>();
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
