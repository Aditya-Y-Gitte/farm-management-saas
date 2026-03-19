using backend.Models;
using backend.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class LivestockService : ILivestockService
    {
        private readonly ILivestockRepository _livestockRepository;

        public LivestockService(ILivestockRepository livestockRepository)
        {
            _livestockRepository = livestockRepository;
        }

        public async Task<Livestock> CreateAsync(Livestock livestock)
        {
            // In a real application, you would have business logic here.
            // For example, validation, sending notifications, etc.
            return await _livestockRepository.CreateAsync(livestock);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _livestockRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Livestock>> GetAllAsync()
        {
            return await _livestockRepository.GetAllAsync();
        }

        public async Task<Livestock?> GetByIdAsync(Guid id)
        {
            return await _livestockRepository.GetByIdAsync(id);
        }

        public async Task<Livestock> UpdateAsync(Livestock livestock)
        {
            // Business logic here
            return await _livestockRepository.UpdateAsync(livestock);
        }
    }
}
