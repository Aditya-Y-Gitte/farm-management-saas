using ProductionApi.DTOs;
using ProductionApi.Models;

namespace ProductionApi.Repositories;

/// <summary>
/// Data access contract for the Dairy domain.
/// Works exclusively on domain models (Dairy) — DTOs are the service layer's concern.
/// Exception: DairySummaryDto is used here because it's a pure aggregation result
/// with no domain identity, making it appropriate for repository output.
/// </summary>
public interface IDairyRepository
{
    Task<(IEnumerable<Dairy> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<Dairy?> GetByIdAsync(Guid id);
    Task<Dairy?> GetByLivestockDateAndSessionAsync(Guid livestockId, DateTime date, string session);
    Task<Dairy> CreateAsync(Dairy dairy);
    Task<Dairy> UpdateAsync(Dairy dairy);
    Task<bool> DeleteAsync(Guid id);
    Task<DairySummaryDto> GetSummaryAsync(DateTime todayStartUtc, DateTime todayEndUtc, DateTime weekStartUtc, DateTime weekEndUtc);
}
