using CatalogApi.Models;
using CatalogApi.Repositories;

namespace CatalogApi.Services;

public class LivestockService : ILivestockService
{
    private readonly ILivestockRepository _livestockRepository;
    private readonly ILogger<LivestockService> _logger;

    public LivestockService(ILivestockRepository livestockRepository, ILogger<LivestockService> logger)
    {
        _livestockRepository = livestockRepository;
        _logger = logger;
    }

    public async Task<Livestock> CreateAsync(Livestock livestock)
    {
        if (!string.IsNullOrWhiteSpace(livestock.Name))
        {
            _logger.LogInformation("Checking for existing livestock with name: {Name}", livestock.Name);
            var existing = await _livestockRepository.GetByNameAsync(livestock.Name);
            if (existing != null)
            {
                _logger.LogWarning("Livestock with name {Name} already exists.", livestock.Name);
                throw new ArgumentException("Livestock with the same name already exists.");
            }
        }

        _logger.LogInformation("Creating new livestock: {Name}", livestock.Name);
        return await _livestockRepository.CreateAsync(livestock);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting livestock: {Id}", id);
        return await _livestockRepository.DeleteAsync(id);
    }

    public async Task<(IEnumerable<Livestock> Items, int TotalCount)> GetAllAsync(int page, int pageSize)
    {
        _logger.LogInformation("Getting all livestock. Page: {Page}, PageSize: {PageSize}", page, pageSize);
        return await _livestockRepository.GetAllAsync(page, pageSize);
    }

    public async Task<Livestock?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Getting livestock by id: {Id}", id);
        return await _livestockRepository.GetByIdAsync(id);
    }

    public async Task<Livestock?> GetByNameAsync(string name)
    {
        _logger.LogInformation("Getting livestock by name: {Name}", name);
        return await _livestockRepository.GetByNameAsync(name);
    }

    public async Task<Livestock> UpdateAsync(Livestock livestock)
    {
        _logger.LogInformation("Updating livestock: {Id}", livestock.Id);
        return await _livestockRepository.UpdateAsync(livestock);
    }

    public async Task<int> GetCountAsync()
    {
        return await _livestockRepository.GetCountAsync();
    }
}
