using FarmManagement.SharedKernel.Models;
using ProductionApi.Models;

namespace ProductionApi.Repositories;

public interface IFeedConsumptionRepository
{
    Task<(IEnumerable<FeedConsumption> Items, int TotalCount)> GetAllAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null, Guid? livestockId = null);
    Task<FeedConsumption?> GetByIdAsync(Guid id);
    Task<FeedConsumption> CreateAsync(FeedConsumption feedConsumption);
    Task<FeedConsumption> UpdateAsync(FeedConsumption feedConsumption);
    Task<bool> DeleteAsync(Guid id);
}
