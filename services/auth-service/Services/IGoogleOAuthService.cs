using AuthService.Models;

namespace AuthService.Services;

public interface IGoogleOAuthService
{
    /// <summary>
    /// Validates a Google ID token and returns user information.
    /// </summary>
    Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken);
}

/// <summary>
/// User information extracted from a Google OAuth ID token.
/// </summary>
public class GoogleUserInfo
{
    public string GoogleId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}
