using FarmManagement.SharedKernel.Models;
using ProductionApi.DTOs;

namespace ProductionApi.Services;

public interface IFeedConsumptionService
{
    Task<PagedResponse<FeedConsumptionDto>> GetAllAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null, Guid? livestockId = null);
    Task<FeedConsumptionDto?> GetByIdAsync(Guid id);
    Task<FeedConsumptionDto> CreateAsync(CreateFeedConsumptionRequest request);
    Task<FeedConsumptionDto> UpdateAsync(Guid id, UpdateFeedConsumptionRequest request);
    Task<bool> DeleteAsync(Guid id);
}
