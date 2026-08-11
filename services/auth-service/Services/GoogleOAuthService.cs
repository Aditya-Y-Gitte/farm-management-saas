using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Services;

/// <summary>
/// Validates Google OAuth ID tokens using Google's public keys.
/// Extracts user profile information from the token payload.
/// </summary>
public class GoogleOAuthService : IGoogleOAuthService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<GoogleOAuthService> _logger;

    public GoogleOAuthService(IConfiguration configuration, ILogger<GoogleOAuthService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken)
    {
        try
        {
            var clientId = _configuration["Google:ClientId"]
                ?? throw new InvalidOperationException("Google ClientId is not configured.");

            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            _logger.LogInformation("Successfully validated Google token for email: {Email}", payload.Email);

            return new GoogleUserInfo
            {
                GoogleId = payload.Subject,
                Email = payload.Email,
                DisplayName = payload.Name ?? payload.Email,
                AvatarUrl = payload.Picture ?? string.Empty
            };
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Invalid Google ID token received.");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating Google ID token.");
            return null;
        }
    }
}
