using System.Text.Json.Serialization;

namespace AuthService.DTOs;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
    
    [JsonIgnore]
    public string RefreshToken { get; set; } = string.Empty;
}
