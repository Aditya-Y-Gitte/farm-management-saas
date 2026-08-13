using CatalogApi.DTOs;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Services;

public interface IHealthRecordService
{
    Task<PagedResponse<HealthRecordDto>> GetAllAsync(int page, int pageSize);
    Task<PagedResponse<HealthRecordDto>> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize);
    Task<HealthRecordDto?> GetByIdAsync(Guid id);
    Task<HealthRecordDto> CreateAsync(CreateHealthRecordRequest request);
    Task<HealthRecordDto> UpdateAsync(Guid id, UpdateHealthRecordRequest request);
    Task<bool> DeleteAsync(Guid id);
}
