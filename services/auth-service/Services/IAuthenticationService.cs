using AuthService.DTOs;

namespace AuthService.Services;

public interface IAuthenticationService
{
    Task<(AuthResponse? Response, string? ErrorMessage)> RegisterAsync(RegisterRequest request);
    Task<(AuthResponse? Response, string? ErrorMessage)> LoginAsync(LoginRequest request);
    Task<(AuthResponse? Response, string? ErrorMessage)> GoogleLoginAsync(GoogleLoginRequest request);
}
