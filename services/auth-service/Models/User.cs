using System.ComponentModel.DataAnnotations;

namespace AuthService.Models;

/// <summary>
/// Represents a registered user in the auth system.
/// Created on first Google OAuth sign-in.
/// </summary>
public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Google's unique user identifier. Optional for users who sign up via Email/Password.
    /// </summary>
    [MaxLength(256)]
    public string? GoogleId { get; set; }

    /// <summary>
    /// Password hash for local authentication. Optional for users who sign up via Google.
    /// </summary>
    [MaxLength(512)]
    public string? PasswordHash { get; set; }

    [Required]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(256)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string AvatarUrl { get; set; } = string.Empty;

    /// <summary>
    /// Tenant identifier — for single-user farms, this defaults to the user's ID.
    /// For multi-user farms, the farm owner's ID serves as the tenant.
    /// </summary>
    [Required]
    [MaxLength(128)]
    public string TenantId { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Role { get; set; } = "owner";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
}
