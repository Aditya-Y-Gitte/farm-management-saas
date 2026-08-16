using CatalogApi.DTOs;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Services;

/// <summary>
/// Business logic contract for Livestock management.
/// All methods accept and return DTOs — the domain model (Livestock) does not cross this boundary.
/// </summary>
public interface ILivestockService
{
    Task<PagedResponse<LivestockDto>> GetAllAsync(int page, int pageSize, string? search = null, string? species = null, string? status = null);
    Task<LivestockDto?> GetByIdAsync(Guid id);
    Task<LivestockDto> CreateAsync(CreateLivestockRequest request);
    Task<LivestockDto> UpdateAsync(Guid id, UpdateLivestockRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<AttentionResponseDto> GetAttentionAsync(int limit);
    Task<CatalogAlertResponseDto> GetAlertsAsync(int limit);
    Task<IEnumerable<LivestockDto>> GetByIdsAsync(IEnumerable<Guid> ids);
    Task<CatalogSummaryDto> GetSummaryAsync();
}
