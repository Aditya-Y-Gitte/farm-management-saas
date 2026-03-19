using backend.Models;
using backend.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class DairyService : IDairyService
    {
        private readonly IDairyRepository _dairyRepository;

        public DairyService(IDairyRepository dairyRepository)
        {
            _dairyRepository = dairyRepository;
        }

        public async Task<Dairy> CreateAsync(Dairy dairy)
        {
            // Business logic here
            return await _dairyRepository.CreateAsync(dairy);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _dairyRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Dairy>> GetAllAsync()
        {
            return await _dairyRepository.GetAllAsync();
        }

        public async Task<Dairy?> GetByIdAsync(Guid id)
        {
            return await _dairyRepository.GetByIdAsync(id);
        }

        public async Task<Dairy> UpdateAsync(Dairy dairy)
        {
            // Business logic here
            return await _dairyRepository.UpdateAsync(dairy);
        }
    }
}
