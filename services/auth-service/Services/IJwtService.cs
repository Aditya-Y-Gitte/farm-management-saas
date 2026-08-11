using AuthService.Models;

namespace AuthService.Services;

public interface IJwtService
{
    /// <summary>
    /// Generates a short-lived access token (JWT) for the given user.
    /// </summary>
    string GenerateAccessToken(User user);

    /// <summary>
    /// Generates a new refresh token and persists it to the database.
    /// </summary>
    Task<string> GenerateRefreshTokenAsync(User user);

    /// <summary>
    /// Validates a refresh token and returns a new access token + refresh token pair.
    /// Implements token rotation: the old refresh token is revoked.
    /// </summary>
    Task<(string accessToken, string refreshToken)?> RefreshTokensAsync(string refreshToken);

    /// <summary>
    /// Revokes all refresh tokens for a user (logout).
    /// </summary>
    Task RevokeAllTokensAsync(Guid userId);

    /// <summary>
    /// Deletes expired and revoked tokens older than 7 days.
    /// Pass userId to scope cleanup; omit for a global cleanup pass.
    /// </summary>
    Task CleanupExpiredTokensAsync(Guid? userId = null);
}
