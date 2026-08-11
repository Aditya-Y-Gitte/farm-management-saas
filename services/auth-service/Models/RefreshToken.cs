using System.ComponentModel.DataAnnotations;

namespace AuthService.Models;

/// <summary>
/// Represents a refresh token for JWT token renewal.
/// Tokens are hashed and support rotation (old tokens are revoked on refresh).
/// </summary>
public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// SHA256 hash of the actual token value. The raw token is only sent to the client once.
    /// </summary>
    [Required]
    [MaxLength(512)]
    public string TokenHash { get; set; } = string.Empty;

    [Required]
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// When this token is used to get a new pair, track which token replaced it.
    /// </summary>
    public Guid? ReplacedByTokenId { get; set; }
}
