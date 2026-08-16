using CatalogApi.Models;

namespace CatalogApi.Repositories;

public interface ILivestockRepository
{
    Task<(IEnumerable<Livestock> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? search = null, string? species = null, string? status = null);
    Task<Livestock?> GetByIdAsync(Guid id);
    Task<Livestock?> GetByNameAsync(string name);
    Task<Livestock?> GetByTagNumberAsync(string tagNumber);
    Task<Livestock> CreateAsync(Livestock livestock);
    Task<Livestock> UpdateAsync(Livestock livestock);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<Livestock>> GetAttentionAsync(int limit);
    Task<IEnumerable<CatalogApi.DTOs.CatalogAlertDto>> GetAlertsAsync(int limit);
    Task<IEnumerable<Livestock>> GetByIdsAsync(IEnumerable<Guid> ids);
    Task<CatalogApi.DTOs.CatalogSummaryDto> GetSummaryAsync();
}
