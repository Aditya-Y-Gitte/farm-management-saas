using AuthService.Models;

namespace AuthService.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByGoogleIdAsync(string googleId);
    Task CreateUserAsync(User user);
    Task UpdateUserAsync(User user);
}
