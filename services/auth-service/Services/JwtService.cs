using AuthService.Data;
using AuthService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AuthService.Services;

/// <summary>
/// JWT service implementing HMAC-SHA256 token signing.
/// Supports short-lived access tokens (15 min) and refresh token rotation (7 days).
/// </summary>
public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly AuthDbContext _context;
    private readonly ILogger<JwtService> _logger;

    public JwtService(IConfiguration configuration, AuthDbContext context, ILogger<JwtService> logger)
    {
        _configuration = configuration;
        _context = context;
        _logger = logger;
    }

    public string GenerateAccessToken(User user)
    {
        var secretKey = _configuration["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey is not configured.");
        var issuer = _configuration["Jwt:Issuer"] ?? "farm-management-auth";
        var audience = _configuration["Jwt:Audience"] ?? "farm-management-api";
        var expiryMinutes = int.Parse(_configuration["Jwt:AccessTokenExpiryMinutes"] ?? "15");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name, user.DisplayName),
            new Claim("tenant_id", user.TenantId),
            new Claim("role", user.Role),
            new Claim("avatar_url", user.AvatarUrl ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        _logger.LogInformation("Generated access token for user {UserId}, tenant {TenantId}", user.Id, user.TenantId);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateRefreshTokenAsync(User user)
    {
        var expiryDays = int.Parse(_configuration["Jwt:RefreshTokenExpiryDays"] ?? "7");

        // Generate a cryptographically secure random token
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var rawToken = Convert.ToBase64String(randomBytes);

        var refreshToken = new RefreshToken
        {
            TokenHash = HashToken(rawToken),
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Generated refresh token for user {UserId}", user.Id);
        return rawToken;
    }

    public async Task<(string accessToken, string refreshToken)?> RefreshTokensAsync(string refreshToken)
    {
        var tokenHash = HashToken(refreshToken);
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

        if (storedToken == null)
        {
            _logger.LogWarning("Refresh token not found.");
            return null;
        }

        if (storedToken.IsRevoked)
        {
            _logger.LogWarning("Attempted use of revoked refresh token for user {UserId}. Revoking all tokens.", storedToken.UserId);
            // If a revoked token is used, revoke ALL tokens for this user (security measure)
            await RevokeAllTokensAsync(storedToken.UserId);
            return null;
        }

        if (storedToken.ExpiresAt < DateTime.UtcNow)
        {
            _logger.LogWarning("Expired refresh token for user {UserId}.", storedToken.UserId);
            return null;
        }

        // Rotate: revoke the old token
        storedToken.IsRevoked = true;

        // Generate new pair
        var newAccessToken = GenerateAccessToken(storedToken.User);
        var newRefreshToken = await GenerateRefreshTokenAsync(storedToken.User);

        // Link old token to new one for audit trail
        var newTokenHash = HashToken(newRefreshToken);
        var newStoredToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == newTokenHash);
        if (newStoredToken != null)
        {
            storedToken.ReplacedByTokenId = newStoredToken.Id;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Rotated refresh token for user {UserId}", storedToken.UserId);
        return (newAccessToken, newRefreshToken);
    }

    public async Task RevokeAllTokensAsync(Guid userId)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Revoked all refresh tokens for user {UserId}. Count: {Count}", userId, tokens.Count);
    }

    /// <summary>
    /// Deletes expired and revoked tokens to keep the refresh_tokens table lean.
    /// On free-tier databases (Neon 512 MB), unbounded growth causes storage issues.
    /// Scoped to a userId when called on login; global cleanup on logout.
    /// </summary>
    public async Task CleanupExpiredTokensAsync(Guid? userId = null)
    {
        var cutoff = DateTime.UtcNow;
        var query = _context.RefreshTokens
            .Where(rt => rt.ExpiresAt < cutoff || rt.IsRevoked);

        if (userId.HasValue)
        {
            query = query.Where(rt => rt.UserId == userId.Value);
        }

        var staleTokens = await query.ToListAsync();
        if (staleTokens.Count > 0)
        {
            _context.RefreshTokens.RemoveRange(staleTokens);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Cleaned up {Count} expired/revoked refresh tokens{Scope}.",
                staleTokens.Count, userId.HasValue ? $" for user {userId.Value}" : " (global)");
        }
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }
}
