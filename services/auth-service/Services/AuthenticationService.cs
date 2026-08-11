using AuthService.DTOs;
using AuthService.Models;
using AuthService.Repositories;

namespace AuthService.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserRepository _userRepository;
    private readonly IGoogleOAuthService _googleOAuthService;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        IUserRepository userRepository,
        IGoogleOAuthService googleOAuthService,
        IJwtService jwtService,
        ILogger<AuthenticationService> logger)
    {
        _userRepository = userRepository;
        _googleOAuthService = googleOAuthService;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<(AuthResponse? Response, string? ErrorMessage)> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return (null, "Email and Password are required.");
        }

        var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return (null, "Email is already in use.");
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            DisplayName = request.DisplayName ?? request.Email.Split('@')[0],
            Role = "owner"
        };
        user.TenantId = user.Id.ToString();

        await _userRepository.CreateUserAsync(user);
        _logger.LogInformation("Created new local user: {Email}, TenantId: {TenantId}", user.Email, user.TenantId);

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<(AuthResponse? Response, string? ErrorMessage)> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return (null, "Email and Password are required.");
        }

        var user = await _userRepository.GetUserByEmailAsync(request.Email);
        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
        {
            return (null, "Invalid email or password.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return (null, "Invalid email or password.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateUserAsync(user);

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<(AuthResponse? Response, string? ErrorMessage)> GoogleLoginAsync(GoogleLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
        {
            return (null, "Google ID token is required.");
        }

        var googleUser = await _googleOAuthService.ValidateGoogleTokenAsync(request.IdToken);
        if (googleUser == null)
        {
            return (null, "Invalid Google token.");
        }

        var user = await _userRepository.GetUserByGoogleIdAsync(googleUser.GoogleId);
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
            user.TenantId = user.Id.ToString();
            await _userRepository.CreateUserAsync(user);
            _logger.LogInformation("Created new user via Google: {Email}, TenantId: {TenantId}", user.Email, user.TenantId);
        }
        else
        {
            user.DisplayName = googleUser.DisplayName;
            user.AvatarUrl = googleUser.AvatarUrl;
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateUserAsync(user);
            _logger.LogInformation("Existing user logged in via Google: {Email}", user.Email);
        }

        return await GenerateAuthResponseAsync(user);
    }

    private async Task<(AuthResponse Response, string? ErrorMessage)> GenerateAuthResponseAsync(User user)
    {
        await _jwtService.CleanupExpiredTokensAsync(user.Id);

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await _jwtService.GenerateRefreshTokenAsync(user);

        var response = new AuthResponse
        {
            AccessToken = accessToken,
            // We temporarily store the refresh token inside AuthResponse 
            // so the controller can extract it and put it in a cookie. 
            // We should add it to AuthResponse but we need to update AuthResponse.cs to include it!
            // Wait, we can just return a tuple or modify AuthResponse to include RefreshToken and strip it out before sending to client.
            // Let's modify AuthResponse to include RefreshToken (internal use).
            RefreshToken = refreshToken,
            User = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl,
                TenantId = user.TenantId,
                Role = user.Role
            }
        };

        return (response, null);
    }
}
