using CatalogApi.Models;

namespace CatalogApi.Services;

public interface ILivestockService
{
    Task<(IEnumerable<Livestock> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<Livestock?> GetByIdAsync(Guid id);
    Task<Livestock?> GetByNameAsync(string name);
    Task<Livestock> CreateAsync(Livestock livestock);
    Task<Livestock> UpdateAsync(Livestock livestock);
    Task<bool> DeleteAsync(Guid id);
    Task<int> GetCountAsync();
}
