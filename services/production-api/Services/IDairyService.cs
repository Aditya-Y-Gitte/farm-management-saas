using ProductionApi.Models;
using ProductionApi.Repositories;

namespace ProductionApi.Services;

public interface IDairyService
{
    Task<(IEnumerable<Dairy> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<Dairy?> GetByIdAsync(Guid id);
    Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date);
    Task<Dairy> CreateAsync(Dairy dairy);
    Task<Dairy> UpdateAsync(Dairy dairy);
    Task<bool> DeleteAsync(Guid id);
    Task<DairySummary> GetSummaryAsync();
}
