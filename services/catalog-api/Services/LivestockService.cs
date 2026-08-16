using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;
using Mapster;
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
        var dtos = items.Select(i => i.Adapt<LivestockDto>());
        return PagedResponse<LivestockDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<LivestockDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching livestock by id: {Id}", id);
        var entity = await _repository.GetByIdAsync(id);
        return entity?.Adapt<LivestockDto>();
    }

    public async Task<LivestockDto> CreateAsync(CreateLivestockRequest request)
    {
        // Business rule: livestock tag numbers must be unique within a tenant.
        if (!string.IsNullOrWhiteSpace(request.TagNumber))
        {
            var existing = await _repository.GetByTagNumberAsync(request.TagNumber);
            if (existing != null)
            {
                throw new FarmManagement.SharedKernel.Exceptions.ConflictException($"A livestock record with TagNumber '{request.TagNumber}' already exists.");
            }
        }

        var entity = new Livestock
        {
            TagNumber = request.TagNumber,
            Name = request.Name,
            Species = request.Species,
            Breed = request.Breed,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            Status = request.Status,
            AcquisitionType = request.AcquisitionType,
            PurchasePrice = request.PurchasePrice,
            PurchaseDate = request.PurchaseDate
        };

        _logger.LogInformation("Creating livestock: {Name}", entity.Name);
        var created = await _repository.CreateAsync(entity);
        return created.Adapt<LivestockDto>();
    }

    public async Task<LivestockDto> UpdateAsync(Guid id, UpdateLivestockRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity is null)
        {
            throw new FarmManagement.SharedKernel.Exceptions.NotFoundException($"Livestock with id '{id}' was not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.TagNumber) && request.TagNumber != entity.TagNumber)
        {
            var existing = await _repository.GetByTagNumberAsync(request.TagNumber);
            if (existing != null)
            {
                throw new FarmManagement.SharedKernel.Exceptions.ConflictException($"A livestock record with TagNumber '{request.TagNumber}' already exists.");
            }
        }

        // Apply only the mutable fields from the request. TenantId and Id remain immutable.
        entity.TagNumber = request.TagNumber;
        entity.Name = request.Name;
        entity.Species = request.Species;
        entity.Breed = request.Breed;
        entity.DateOfBirth = request.DateOfBirth;
        entity.Gender = request.Gender;
        entity.Status = request.Status;
        entity.AcquisitionType = request.AcquisitionType;
        entity.PurchasePrice = request.PurchasePrice;
        entity.PurchaseDate = request.PurchaseDate;

        _logger.LogInformation("Updating livestock: {Id}", id);
        var updated = await _repository.UpdateAsync(entity);
        return updated.Adapt<LivestockDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting livestock: {Id}", id);
        return await _repository.DeleteAsync(id);
    }

    public async Task<AttentionResponseDto> GetAttentionAsync(int limit)
    {
        _logger.LogInformation("Fetching attention livestock. Limit: {Limit}", limit);
        var items = await _repository.GetAttentionAsync(limit);
        var summary = await _repository.GetSummaryAsync();

        return new AttentionResponseDto
        {
            Items = items.Select(i => i.Adapt<LivestockDto>()),
            TotalCount = summary.AttentionCount
        };
    }

    public async Task<CatalogAlertResponseDto> GetAlertsAsync(int limit)
    {
        _logger.LogInformation("Fetching catalog alerts. Limit: {Limit}", limit);
        var items = await _repository.GetAlertsAsync(limit);
        var summary = await _repository.GetSummaryAsync();

        return new CatalogAlertResponseDto
        {
            Items = items,
            TotalCount = summary.AttentionCount
        };
    }

    public async Task<IEnumerable<LivestockDto>> GetByIdsAsync(IEnumerable<Guid> ids)
    {
        _logger.LogInformation("Fetching livestock batch");
        var items = await _repository.GetByIdsAsync(ids);
        return items.Select(i => i.Adapt<LivestockDto>());
    }

    public async Task<CatalogSummaryDto> GetSummaryAsync()
    {
        return await _repository.GetSummaryAsync();
    }
}
