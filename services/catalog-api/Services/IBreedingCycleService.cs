using CatalogApi.DTOs;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Services;

public interface IBreedingCycleService
{
    Task<PagedResponse<BreedingCycleDto>> GetAllAsync(int page, int pageSize);
    Task<PagedResponse<BreedingCycleDto>> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize);
    Task<BreedingCycleDto?> GetByIdAsync(Guid id);
    Task<BreedingCycleDto> CreateAsync(CreateBreedingCycleRequest request);
    Task<BreedingCycleDto> UpdateAsync(Guid id, UpdateBreedingCycleRequest request);
    Task<bool> DeleteAsync(Guid id);
}
