using FarmManagement.SharedKernel.Models;
using ProductionApi.DTOs;

namespace ProductionApi.Services;

/// <summary>
/// Business logic contract for Dairy production management.
/// All methods accept and return DTOs — the domain model (Dairy) does not cross this boundary.
/// Note: no import of ProductionApi.Repositories here — that was a layer inversion bug.
/// </summary>
public interface IDairyService
{
    Task<PagedResponse<DairyDto>> GetAllAsync(int page, int pageSize);
    Task<PagedResponse<DairyDto>> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize);
    Task<DairyDto?> GetByIdAsync(Guid id);
    Task<DairyDto?> GetByLivestockDateAndSessionAsync(Guid livestockId, DateTime date, string session);
    Task<DairyDto> CreateAsync(CreateDairyRequest request);
    Task<DairyDto> UpdateAsync(Guid id, UpdateDairyRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<DairySummaryDto> GetSummaryAsync(Guid? livestockId = null);
}
