using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Services;

/// <summary>
/// Livestock business logic service.
/// Owns mapping between DTOs and domain entities.
/// Owns business rule enforcement (e.g. name uniqueness).
/// Does not know about HTTP or EF Core.
/// </summary>
public class LivestockService : ILivestockService
{
    private readonly ILivestockRepository _repository;
    private readonly ILogger<LivestockService> _logger;

    public LivestockService(ILivestockRepository repository, ILogger<LivestockService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PagedResponse<LivestockDto>> GetAllAsync(int page, int pageSize)
    {
        _logger.LogInformation("Fetching livestock. Page: {Page}, PageSize: {PageSize}", page, pageSize);
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize);
        var dtos = items.Select(LivestockDto.FromEntity);
        return PagedResponse<LivestockDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<LivestockDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching livestock by id: {Id}", id);
        var entity = await _repository.GetByIdAsync(id);
        return entity is null ? null : LivestockDto.FromEntity(entity);
    }

    public async Task<LivestockDto> CreateAsync(CreateLivestockRequest request)
    {
        // Business rule: livestock names must be unique within a tenant.
        // The unique DB index enforces this at the data layer too, but we fail fast here.
        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            var existing = await _repository.GetByNameAsync(request.Name);
            if (existing != null)
            {
                _logger.LogWarning("Duplicate livestock name: {Name}", request.Name);
                throw new ArgumentException($"A livestock record named '{request.Name}' already exists.");
            }
        }

        var entity = new Livestock
        {
            Name = request.Name,
            Species = request.Species,
            Breed = request.Breed,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            HealthStatus = request.HealthStatus,
            Medication = request.Medication,
            Vaccination = request.Vaccination
        };

        _logger.LogInformation("Creating livestock: {Name}", entity.Name);
        var created = await _repository.CreateAsync(entity);
        return LivestockDto.FromEntity(created);
    }

    public async Task<LivestockDto> UpdateAsync(Guid id, UpdateLivestockRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity is null)
        {
            throw new KeyNotFoundException($"Livestock with id '{id}' was not found.");
        }

        // Apply only the mutable fields from the request. TenantId and Id remain immutable.
        entity.Name = request.Name;
        entity.Species = request.Species;
        entity.Breed = request.Breed;
        entity.DateOfBirth = request.DateOfBirth;
        entity.Gender = request.Gender;
        entity.HealthStatus = request.HealthStatus;
        entity.Medication = request.Medication;
        entity.Vaccination = request.Vaccination;

        _logger.LogInformation("Updating livestock: {Id}", id);
        var updated = await _repository.UpdateAsync(entity);
        return LivestockDto.FromEntity(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting livestock: {Id}", id);
        return await _repository.DeleteAsync(id);
    }

    public async Task<int> GetCountAsync()
    {
        return await _repository.GetCountAsync();
    }
}
