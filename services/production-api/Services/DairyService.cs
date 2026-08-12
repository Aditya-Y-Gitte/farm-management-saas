using FarmManagement.SharedKernel.Models;
using ProductionApi.DTOs;
using ProductionApi.Models;
using ProductionApi.Repositories;

namespace ProductionApi.Services;

/// <summary>
/// Dairy production business logic service.
/// Owns mapping between DTOs and domain entities.
/// Owns business rules (e.g. duplicate record prevention per livestock per day).
/// Does not know about HTTP or EF Core.
/// </summary>
public class DairyService : IDairyService
{
    private readonly IDairyRepository _repository;
    private readonly ILogger<DairyService> _logger;

    public DairyService(IDairyRepository repository, ILogger<DairyService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PagedResponse<DairyDto>> GetAllAsync(int page, int pageSize)
    {
        _logger.LogInformation("Fetching dairy records. Page: {Page}, PageSize: {PageSize}", page, pageSize);
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize);
        var dtos = items.Select(DairyDto.FromEntity);
        return PagedResponse<DairyDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<DairyDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching dairy record: {Id}", id);
        var entity = await _repository.GetByIdAsync(id);
        return entity is null ? null : DairyDto.FromEntity(entity);
    }

    public async Task<DairyDto?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date)
    {
        var entity = await _repository.GetByLivestockIdAndDateAsync(livestockId, date);
        return entity is null ? null : DairyDto.FromEntity(entity);
    }

    public async Task<DairyDto> CreateAsync(CreateDairyRequest request)
    {
        // Business rule: one dairy record per livestock per day.
        var existing = await _repository.GetByLivestockIdAndDateAsync(request.LivestockId, request.Date);
        if (existing != null)
        {
            _logger.LogWarning("Duplicate dairy record. LivestockId: {LivestockId}, Date: {Date}",
                request.LivestockId, request.Date.Date);
            throw new ArgumentException(
                $"A dairy record for livestock '{request.LivestockId}' on '{request.Date:yyyy-MM-dd}' already exists.");
        }

        var entity = new Dairy
        {
            LivestockId = request.LivestockId,
            Date = request.Date,
            MilkYield = request.MilkYield,
            FatContent = request.FatContent,
            ProteinContent = request.ProteinContent,
            Quality = request.Quality
        };

        _logger.LogInformation("Creating dairy record for livestock {LivestockId}", entity.LivestockId);
        var created = await _repository.CreateAsync(entity);
        return DairyDto.FromEntity(created);
    }

    public async Task<DairyDto> UpdateAsync(Guid id, UpdateDairyRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity is null)
        {
            throw new KeyNotFoundException($"Dairy record with id '{id}' was not found.");
        }

        // Apply only mutable fields. TenantId and Id remain immutable.
        entity.LivestockId = request.LivestockId;
        entity.Date = request.Date;
        entity.MilkYield = request.MilkYield;
        entity.FatContent = request.FatContent;
        entity.ProteinContent = request.ProteinContent;
        entity.Quality = request.Quality;

        _logger.LogInformation("Updating dairy record: {Id}", id);
        var updated = await _repository.UpdateAsync(entity);
        return DairyDto.FromEntity(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting dairy record: {Id}", id);
        return await _repository.DeleteAsync(id);
    }

    public async Task<DairySummaryDto> GetSummaryAsync()
    {
        _logger.LogInformation("Fetching dairy summary");
        return await _repository.GetSummaryAsync();
    }
}
