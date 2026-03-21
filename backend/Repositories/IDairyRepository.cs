using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IDairyRepository
    {
        Task<IEnumerable<Dairy>> GetAllAsync();
        Task<Dairy?> GetByIdAsync(Guid id);
        Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date);
        Task<Dairy> CreateAsync(Dairy dairy);
        Task<Dairy> UpdateAsync(Dairy dairy);
        Task<bool> DeleteAsync(Guid id);
    }
}
