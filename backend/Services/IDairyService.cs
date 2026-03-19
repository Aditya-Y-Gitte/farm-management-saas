using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IDairyService
    {
        Task<IEnumerable<Dairy>> GetAllAsync();
        Task<Dairy?> GetByIdAsync(Guid id);
        Task<Dairy> CreateAsync(Dairy dairy);
        Task<Dairy> UpdateAsync(Dairy dairy);
        Task<bool> DeleteAsync(Guid id);
    }
}
