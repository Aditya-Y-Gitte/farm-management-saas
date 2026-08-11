using ProductionApi.Models;
using ProductionApi.Repositories;

namespace ProductionApi.Services;

public class DairyService : IDairyService
{
    private readonly IDairyRepository _dairyRepository;
    private readonly ILogger<DairyService> _logger;

    public DairyService(IDairyRepository dairyRepository, ILogger<DairyService> logger)
    {
        _dairyRepository = dairyRepository;
        _logger = logger;
    }

    public async Task<Dairy> CreateAsync(Dairy dairy)
    {
        _logger.LogInformation("Checking for existing dairy record: LivestockId={LivestockId}, Date={Date}",
            dairy.LivestockId, dairy.Date);

        var existing = await _dairyRepository.GetByLivestockIdAndDateAsync(dairy.LivestockId, dairy.Date);
        if (existing != null)
        {
            _logger.LogWarning("Duplicate dairy record for livestock {LivestockId} on {Date}",
                dairy.LivestockId, dairy.Date);
            throw new ArgumentException("Dairy record for this livestock on this date already exists.");
        }

        _logger.LogInformation("Creating dairy record for livestock {LivestockId}", dairy.LivestockId);
        return await _dairyRepository.CreateAsync(dairy);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting dairy record: {Id}", id);
        return await _dairyRepository.DeleteAsync(id);
    }

    public async Task<(IEnumerable<Dairy> Items, int TotalCount)> GetAllAsync(int page, int pageSize)
    {
        _logger.LogInformation("Getting dairy records. Page: {Page}, PageSize: {PageSize}", page, pageSize);
        return await _dairyRepository.GetAllAsync(page, pageSize);
    }

    public async Task<Dairy?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Getting dairy record: {Id}", id);
        return await _dairyRepository.GetByIdAsync(id);
    }

    public async Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date)
    {
        return await _dairyRepository.GetByLivestockIdAndDateAsync(livestockId, date);
    }

    public async Task<Dairy> UpdateAsync(Dairy dairy)
    {
        _logger.LogInformation("Updating dairy record: {Id}", dairy.Id);
        return await _dairyRepository.UpdateAsync(dairy);
    }

    public async Task<DairySummary> GetSummaryAsync()
    {
        _logger.LogInformation("Getting dairy summary");
        return await _dairyRepository.GetSummaryAsync();
    }
}
