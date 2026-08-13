using CatalogApi.Models;

namespace CatalogApi.Repositories;

public interface IBreedingCycleRepository
{
    Task<(IEnumerable<BreedingCycle> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<(IEnumerable<BreedingCycle> Items, int TotalCount)> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize);
    Task<BreedingCycle?> GetByIdAsync(Guid id);
    Task<BreedingCycle> CreateAsync(BreedingCycle record);
    Task<BreedingCycle> UpdateAsync(BreedingCycle record);
    Task<bool> DeleteAsync(Guid id);
}
