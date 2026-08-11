using AuthService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmManagement.SharedKernel.Auth;
using AuthService.DTOs;

namespace AuthService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IAuthenticationService authenticationService,
        IJwtService jwtService,
        ILogger<AuthController> logger,
        IWebHostEnvironment environment)
    {
        _authenticationService = authenticationService;
        _jwtService = jwtService;
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
        var (response, errorMessage) = await _authenticationService.GoogleLoginAsync(request);
        
        if (errorMessage != null || response == null)
        {
            return Unauthorized(new { message = errorMessage });
        }

        SetRefreshTokenCookie(response.RefreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Registers a new user via Email and Password.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (response, errorMessage) = await _authenticationService.RegisterAsync(request);
        
        if (errorMessage != null || response == null)
        {
            return BadRequest(new { message = errorMessage });
        }

        SetRefreshTokenCookie(response.RefreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Authenticates a user with Email and Password.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (response, errorMessage) = await _authenticationService.LoginAsync(request);
        
        if (errorMessage != null || response == null)
        {
            return Unauthorized(new { message = errorMessage });
        }

        SetRefreshTokenCookie(response.RefreshToken);
        return Ok(response);
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
