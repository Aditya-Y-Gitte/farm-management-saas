using backend.Models;
using backend.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
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
            if (livestock.Name != null)
            {
                _logger.LogInformation("Checking for existing livestock with name: {Name}", livestock.Name);
                var existingLivestock = await _livestockRepository.GetByNameAsync(livestock.Name);
                if (existingLivestock != null)
                {
                    _logger.LogError("Livestock with name {Name} already exists.", livestock.Name);
                    throw new Exception("Livestock with the same name already exists.");
                }
            }

            _logger.LogInformation("Creating new livestock with name: {Name}", livestock.Name);
            return await _livestockRepository.CreateAsync(livestock);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            _logger.LogInformation("Deleting livestock with id: {Id}", id);
            return await _livestockRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Livestock>> GetAllAsync()
        {
            _logger.LogInformation("Getting all livestock.");
            return await _livestockRepository.GetAllAsync();
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
            _logger.LogInformation("Updating livestock with id: {Id}", livestock.Id);
            return await _livestockRepository.UpdateAsync(livestock);
        }
    }
}

