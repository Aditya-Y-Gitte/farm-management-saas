using CatalogApi.Models;

namespace CatalogApi.Repositories;

public interface IHealthRecordRepository
{
    Task<(IEnumerable<HealthRecord> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<(IEnumerable<HealthRecord> Items, int TotalCount)> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize);
    Task<HealthRecord?> GetByIdAsync(Guid id);
    Task<HealthRecord> CreateAsync(HealthRecord record);
    Task<HealthRecord> UpdateAsync(HealthRecord record);
    Task<bool> DeleteAsync(Guid id);
}
