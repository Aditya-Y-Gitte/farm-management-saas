using AuthService.Data;
using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FarmManagement.SharedKernel.Auth;

namespace AuthService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IGoogleOAuthService _googleOAuthService;
    private readonly IJwtService _jwtService;
    private readonly AuthDbContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IGoogleOAuthService googleOAuthService,
        IJwtService jwtService,
        AuthDbContext context,
        ILogger<AuthController> logger,
        IWebHostEnvironment environment)
    {
        _googleOAuthService = googleOAuthService;
        _jwtService = jwtService;
        _context = context;
        _logger = logger;
        _environment = environment;
    }

    /// <summary>
    /// Authenticates a user with a Google ID token.
    /// Creates a new user on first sign-in. Returns JWT access + refresh tokens.
    /// </summary>
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
        {
            return BadRequest(new { message = "Google ID token is required." });
        }

        var googleUser = await _googleOAuthService.ValidateGoogleTokenAsync(request.IdToken);
        if (googleUser == null)
        {
            return Unauthorized(new { message = "Invalid Google token." });
        }

        // Find or create user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleUser.GoogleId);
        if (user == null)
        {
            user = new User
            {
                GoogleId = googleUser.GoogleId,
                Email = googleUser.Email,
                DisplayName = googleUser.DisplayName,
                AvatarUrl = googleUser.AvatarUrl,
                Role = "owner"
            };
            // For new users, TenantId = their own UserId (they own their farm)
            user.TenantId = user.Id.ToString();
            _context.Users.Add(user);
            _logger.LogInformation("Created new user: {Email}, TenantId: {TenantId}", user.Email, user.TenantId);
        }
        else
        {
            // Update profile info on each login
            user.DisplayName = googleUser.DisplayName;
            user.AvatarUrl = googleUser.AvatarUrl;
            user.LastLoginAt = DateTime.UtcNow;
            _logger.LogInformation("Existing user logged in: {Email}", user.Email);
        }

        await _context.SaveChangesAsync();

        // Housekeeping: purge expired tokens to keep the DB lean (important on free-tier)
        await _jwtService.CleanupExpiredTokensAsync(user.Id);

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await _jwtService.GenerateRefreshTokenAsync(user);

        // Set refresh token in httpOnly cookie
        SetRefreshTokenCookie(refreshToken);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            User = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl,
                TenantId = user.TenantId,
                Role = user.Role
            }
        });
    }

    /// <summary>
    /// Refreshes the access token using the refresh token from the httpOnly cookie.
    /// Implements token rotation.
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { message = "Refresh token not found." });
        }

        var result = await _jwtService.RefreshTokensAsync(refreshToken);
        if (result == null)
        {
            // Clear the invalid cookie
            Response.Cookies.Delete("refreshToken");
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        var (newAccessToken, newRefreshToken) = result.Value;
        SetRefreshTokenCookie(newRefreshToken);

        return Ok(new { accessToken = newAccessToken });
    }

    /// <summary>
    /// Returns the current user's profile from JWT claims.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        return Ok(new UserDto
        {
            Id = User.GetUserId(),
            Email = User.GetEmail(),
            DisplayName = User.GetDisplayName(),
            AvatarUrl = User.FindFirst("avatar_url")?.Value ?? "",
            TenantId = User.GetTenantId(),
            Role = User.GetRole()
        });
    }

    /// <summary>
    /// Logs out the user by revoking all refresh tokens and clearing the cookie.
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = Guid.Parse(User.GetUserId());
        await _jwtService.RevokeAllTokensAsync(userId);

        // Purge all expired tokens across all users periodically on logout
        await _jwtService.CleanupExpiredTokensAsync();

        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = !_environment.IsDevelopment(),
            SameSite = _environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Path = "/api/auth"
        });
        _logger.LogInformation("User {UserId} logged out.", userId);

        return Ok(new { message = "Logged out successfully." });
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        // SameSite=None + Secure=true required for cross-origin cookie (Netlify → Render).
        // In local dev (HTTP), Secure must be false and SameSite=Lax so the cookie is actually set.
        var isProduction = !_environment.IsDevelopment();
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = isProduction ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/api/auth"
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}

// --- Request / Response DTOs ---

public class GoogleLoginRequest
{
    public string IdToken { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
