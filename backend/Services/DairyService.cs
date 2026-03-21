using backend.Models;
using backend.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
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
            _logger.LogInformation("Checking for existing dairy record for livestock {LivestockId} on date {Date}", dairy.LivestockId, dairy.Date);
            var existingDairy = await _dairyRepository.GetByLivestockIdAndDateAsync(dairy.LivestockId, dairy.Date);
            if (existingDairy != null)
            {
                _logger.LogError("Dairy record for livestock {LivestockId} on date {Date} already exists.", dairy.LivestockId, dairy.Date);
                throw new Exception("Dairy record for this livestock on this date already exists.");
            }

            _logger.LogInformation("Creating new dairy record for livestock {LivestockId}", dairy.LivestockId);
            return await _dairyRepository.CreateAsync(dairy);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            _logger.LogInformation("Deleting dairy record with id: {Id}", id);
            return await _dairyRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Dairy>> GetAllAsync()
        {
            _logger.LogInformation("Getting all dairy records.");
            return await _dairyRepository.GetAllAsync();
        }

        public async Task<Dairy?> GetByIdAsync(Guid id)
        {
            _logger.LogInformation("Getting dairy record by id: {Id}", id);
            return await _dairyRepository.GetByIdAsync(id);
        }

        public async Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date)
        {
            _logger.LogInformation("Getting dairy record by livestock id {LivestockId} and date {Date}", livestockId, date);
            return await _dairyRepository.GetByLivestockIdAndDateAsync(livestockId, date);
        }

        public async Task<Dairy> UpdateAsync(Dairy dairy)
        {
            _logger.LogInformation("Updating dairy record with id: {Id}", dairy.Id);
            return await _dairyRepository.UpdateAsync(dairy);
        }
    }
}
