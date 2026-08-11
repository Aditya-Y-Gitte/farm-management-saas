using System.Security.Claims;

namespace FarmManagement.SharedKernel.Auth;

/// <summary>
/// Extension methods for extracting tenant and user information from JWT claims.
/// Used by Catalog and Production APIs to scope queries by tenant.
/// </summary>
public static class JwtClaimsExtensions
{
    public const string TenantIdClaimType = "tenant_id";
    public const string RoleClaimType = "role";

    /// <summary>
    /// Extracts the user ID (sub claim) from the claims principal.
    /// </summary>
    public static string GetUserId(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("User ID claim not found in token.");
    }

    /// <summary>
    /// Extracts the tenant ID from the claims principal.
    /// </summary>
    public static string GetTenantId(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(TenantIdClaimType)
            ?? throw new UnauthorizedAccessException("Tenant ID claim not found in token.");
    }

    /// <summary>
    /// Extracts the email from the claims principal.
    /// </summary>
    public static string GetEmail(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(ClaimTypes.Email)
            ?? principal.FindFirstValue("email")
            ?? string.Empty;
    }

    /// <summary>
    /// Extracts the display name from the claims principal.
    /// </summary>
    public static string GetDisplayName(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(ClaimTypes.Name)
            ?? principal.FindFirstValue("name")
            ?? string.Empty;
    }

    /// <summary>
    /// Extracts the user role from the claims principal.
    /// </summary>
    public static string GetRole(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(RoleClaimType)
            ?? principal.FindFirstValue(ClaimTypes.Role)
            ?? "user";
    }
}
