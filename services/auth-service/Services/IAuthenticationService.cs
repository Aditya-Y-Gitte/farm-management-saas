using AuthService.DTOs;

namespace AuthService.Services;

public interface IAuthenticationService
{
    Task<(AuthResponse? Response, string? ErrorMessage, int StatusCode)> RegisterAsync(RegisterRequest request);
    Task<(AuthResponse? Response, string? ErrorMessage, int StatusCode)> LoginAsync(LoginRequest request);
    Task<(AuthResponse? Response, string? ErrorMessage, int StatusCode)> GoogleLoginAsync(GoogleLoginRequest request);
}
