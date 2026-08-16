using FarmManagement.SharedKernel.Models;
using ProductionApi.DTOs;
using ProductionApi.Models;
using ProductionApi.Repositories;
using Mapster;

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
    private readonly IDateTimeService _dateTimeService;
    private readonly ILogger<DairyService> _logger;

    public DairyService(IDairyRepository repository, IDateTimeService dateTimeService, ILogger<DairyService> logger)
    {
        _repository = repository;
        _dateTimeService = dateTimeService;
        _logger = logger;
    }

    public async Task<PagedResponse<DairyDto>> GetAllAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null, Guid? livestockId = null, string? session = null)
    {
        _logger.LogInformation("Fetching dairy records. Page: {Page}, PageSize: {PageSize}", page, pageSize);
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize, startDate, endDate, livestockId, session);
        var dtos = items.Select(i => i.Adapt<DairyDto>());
        return PagedResponse<DairyDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<PagedResponse<DairyDto>> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize)
    {
        _logger.LogInformation("Fetching dairy records for livestock {LivestockId}. Page: {Page}, PageSize: {PageSize}", livestockId, page, pageSize);
        var (items, totalCount) = await _repository.GetByLivestockIdAsync(livestockId, page, pageSize);
        var dtos = items.Select(i => i.Adapt<DairyDto>());
        return PagedResponse<DairyDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<DairyDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching dairy record: {Id}", id);
        var entity = await _repository.GetByIdAsync(id);
        return entity?.Adapt<DairyDto>();
    }

    public async Task<DairyDto?> GetByLivestockDateAndSessionAsync(Guid livestockId, DateTime date, string session)
    {
        var entity = await _repository.GetByLivestockDateAndSessionAsync(livestockId, date, session);
        return entity?.Adapt<DairyDto>();
    }

    public async Task<DairyDto> CreateAsync(CreateDairyRequest request)
    {
        // Business rule: one dairy record per livestock per day per session.
        var existing = await _repository.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session);
        if (existing != null)
        {
            _logger.LogWarning("Duplicate dairy record. LivestockId: {LivestockId}, Date: {Date}, Session: {Session}",
                request.LivestockId, request.Date.Date, request.Session);
            throw new FarmManagement.SharedKernel.Exceptions.ConflictException(
                $"A dairy record for livestock '{request.LivestockId}' on '{request.Date:yyyy-MM-dd}' during '{request.Session}' session already exists.");
        }

        var entity = new Dairy
        {
            LivestockId = request.LivestockId,
            Date = request.Date,
            Session = request.Session,
            MilkYield = request.MilkYield,
            FatContent = request.FatContent,
            ProteinContent = request.ProteinContent,
            SnfContent = request.SnfContent,
            Quality = request.Quality
        };

        _logger.LogInformation("Creating dairy record for livestock {LivestockId}", entity.LivestockId);
        var created = await _repository.CreateAsync(entity);
        return created.Adapt<DairyDto>();
    }

    public async Task<DairyDto> UpdateAsync(Guid id, UpdateDairyRequest request)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity is null)
        {
            throw new FarmManagement.SharedKernel.Exceptions.NotFoundException($"Dairy record with id '{id}' was not found.");
        }

        // Business rule: Check if updating to an existing livestock+date+session combination (excluding self)
        var existing = await _repository.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session);
        if (existing != null && existing.Id != id)
        {
            throw new FarmManagement.SharedKernel.Exceptions.ConflictException(
                $"A dairy record for livestock '{request.LivestockId}' on '{request.Date:yyyy-MM-dd}' during '{request.Session}' session already exists.");
        }

        // Apply only mutable fields. TenantId and Id remain immutable.
        entity.LivestockId = request.LivestockId;
        entity.Date = request.Date;
        entity.Session = request.Session;
        entity.MilkYield = request.MilkYield;
        entity.FatContent = request.FatContent;
        entity.ProteinContent = request.ProteinContent;
        entity.SnfContent = request.SnfContent;
        entity.Quality = request.Quality;

        _logger.LogInformation("Updating dairy record: {Id}", id);
        var updated = await _repository.UpdateAsync(entity);
        return updated.Adapt<DairyDto>();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting dairy record: {Id}", id);
        return await _repository.DeleteAsync(id);
    }

    public async Task<DairySummaryDto> GetSummaryAsync(Guid? livestockId = null)
    {
        _logger.LogInformation("Fetching dairy summary");
        var today = _dateTimeService.GetTodayBoundariesUtc();
        var week = _dateTimeService.GetThisWeekBoundariesUtc();

        return await _repository.GetSummaryAsync(today.StartUtc, today.EndUtc, week.StartUtc, week.EndUtc, livestockId);
    }

    public async Task<DairyTrendResponse> GetTrendsAsync(DateTime startDate, DateTime endDate, Guid? livestockId = null, string? session = null)
    {
        _logger.LogInformation("Fetching dairy trends from {StartDate} to {EndDate}", startDate, endDate);
        var points = await _repository.GetTrendsAsync(startDate, endDate, livestockId, session);
        return new DairyTrendResponse { Points = points };
    }

    public async Task<DairyAlertResponseDto> GetAlertsAsync(int limit)
    {
        _logger.LogInformation("Calculating dairy alerts. Limit: {Limit}", limit);
        
        const decimal MilkDropThreshold = 0.20M;
        const int MinimumBaselineDays = 3;
        
        var todayBoundaries = _dateTimeService.GetTodayBoundariesUtc();
        var baselineStart = todayBoundaries.StartUtc.AddDays(-7);
        
        var records = await _repository.GetRecentYieldsAsync(baselineStart, todayBoundaries.EndUtc);
        
        var alerts = new List<DairyAlertDto>();
        
        var groupedByAnimal = records.GroupBy(r => r.LivestockId);
        
        foreach (var group in groupedByAnimal)
        {
            var todayRecords = group.Where(r => r.Date >= todayBoundaries.StartUtc).ToList();
            if (!todayRecords.Any())
            {
                continue; // No milk today, cannot determine a drop
            }
            
            var todayTotal = todayRecords.Sum(r => r.MilkYield);
            
            var baselineRecords = group.Where(r => r.Date < todayBoundaries.StartUtc).ToList();
            var uniqueBaselineDays = baselineRecords.Select(r => r.Date.Date).Distinct().Count();
            
            if (uniqueBaselineDays < MinimumBaselineDays)
            {
                continue; // Insufficient history
            }
            
            var baselineDailyAvg = baselineRecords.Sum(r => r.MilkYield) / uniqueBaselineDays;
            
            if (baselineDailyAvg > 0 && todayTotal < baselineDailyAvg * (1 - MilkDropThreshold))
            {
                alerts.Add(new DairyAlertDto
                {
                    LivestockId = group.Key,
                    AlertType = "MilkDrop",
                    Date = todayBoundaries.StartUtc,
                    CurrentValue = todayTotal,
                    BaselineValue = baselineDailyAvg
                });
            }
        }
        
        var topAlerts = alerts.OrderByDescending(a => a.Date).Take(limit).ToList();
        
        return new DairyAlertResponseDto
        {
            Items = topAlerts,
            TotalCount = alerts.Count
        };
    }
}
