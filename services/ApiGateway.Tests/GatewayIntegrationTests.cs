using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace ApiGateway.Tests;

public class GatewayIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public GatewayIntegrationTests(WebApplicationFactory<Program> factory)
    {
        // Override configuration for tests
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "Jwt:SecretKey", "TestSecretKeyThatIsAtLeast32CharactersLong!" },
                    { "Jwt:Issuer", "test-issuer" },
                    { "Jwt:Audience", "test-audience" }
                });
            });
        });
    }

    [Fact]
    public async Task MissingJwt_ProtectedRoutes_Returns401()
    {
        var client = _factory.CreateClient();

        var routes = new[]
        {
            "/api/catalog/livestock",
            "/api/production/dairy",
            "/api/finance/incomes",
            "/api/gateway/metrics"
        };

        foreach (var route in routes)
        {
            var response = await client.GetAsync(route);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }

    [Fact]
    public async Task InvalidJwt_ProtectedRoutes_Returns401()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "invalid.token.here");

        var response = await client.GetAsync("/api/catalog/livestock");
        
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AuthRoute_IsPublic_ForwardsRequest()
    {
        var client = _factory.CreateClient();
        
        // The auth route is not protected by the gateway (no AuthorizationPolicy in appsettings)
        // Since downstream is not running or mocked, YARP will return 502 Bad Gateway or 404, but NOT 401.
        var response = await client.GetAsync("/api/auth/login");
        
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Cors_OptionsRequest_ReturnsAllowedOrigins()
    {
        var client = _factory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/catalog/livestock");
        request.Headers.Add("Origin", "http://localhost:3000");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.True(response.Headers.Contains("Access-Control-Allow-Origin"));
        Assert.Equal("http://localhost:3000", response.Headers.GetValues("Access-Control-Allow-Origin").First());
    }

    [Fact]
    public async Task RateLimiter_ExcessiveRequests_Returns429()
    {
        var client = _factory.CreateClient();
        
        var tasks = new List<Task<HttpResponseMessage>>();
        for (int i = 0; i < 120; i++)
        {
            tasks.Add(client.GetAsync("/api/catalog/livestock"));
        }

        var responses = await Task.WhenAll(tasks);
        
        var tooManyRequests = responses.Any(r => r.StatusCode == HttpStatusCode.TooManyRequests);
        Assert.True(tooManyRequests, "Expected at least one 429 Too Many Requests response");
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsDegraded_WhenServicesAreNotReachable()
    {
        var client = _factory.CreateClient();
        
        var response = await client.GetAsync("/health");
        
        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode); // 503
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("degraded", content);
        Assert.Contains("auth-service", content);
        Assert.Contains("catalog-api", content);
        Assert.Contains("production-api", content);
        Assert.Contains("finance-api", content);
    }
}
