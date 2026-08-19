
using FarmManagement.SharedKernel.Models;
using Mapster;
using Microsoft.Extensions.Logging;
using ProductionApi.DTOs;
using ProductionApi.Models;
using ProductionApi.Repositories;

namespace ProductionApi.Services;

public class FeedConsumptionService : IFeedConsumptionService
{
    private readonly IFeedConsumptionRepository _repository;
    private readonly ILogger<FeedConsumptionService> _logger;

    public FeedConsumptionService(IFeedConsumptionRepository repository, ILogger<FeedConsumptionService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PagedResponse<FeedConsumptionDto>> GetAllAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null, Guid? livestockId = null)
    {
        _logger.LogInformation("Fetching feed consumption records");
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize, startDate, endDate, livestockId);
        var dtos = items.Select(i => i.Adapt<FeedConsumptionDto>());
        return PagedResponse<FeedConsumptionDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<FeedConsumptionDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching feed consumption record: {Id}", id);
        var entity = await _repository.GetByIdAsync(id);
        return entity?.Adapt<FeedConsumptionDto>();
    }

    public async Task<FeedConsumptionDto> CreateAsync(CreateFeedConsumptionRequest request)
    {
        var entity = new FeedConsumption
        {
            LivestockId = request.LivestockId,
            Date = request.Date,
            FeedType = request.FeedType,
            Quantity = request.Quantity,
            Unit = request.Unit,
            Notes = request.Notes
        };

        _logger.LogInformation("Creating feed consumption record");
        var created = await _repository.CreateAsync(entity);
        return created.Adapt<FeedConsumptionDto>();
    }

    public async Task<FeedConsumptionDto> UpdateAsync(Guid id, UpdateFeedConsumptionRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity is null)
        {
            throw new KeyNotFoundException($"Feed consumption record with id '{id}' was not found.");
        }

        entity.LivestockId = request.LivestockId;
        entity.Date = request.Date;
        entity.FeedType = request.FeedType;
        entity.Quantity = request.Quantity;
        entity.Unit = request.Unit;
        entity.Notes = request.Notes;

        _logger.LogInformation("Updating feed consumption record: {Id}", id);
        var updated = await _repository.UpdateAsync(entity);
        return updated.Adapt<FeedConsumptionDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting feed consumption record: {Id}", id);
        return await _repository.DeleteAsync(id);
    }
}
