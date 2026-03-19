using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface ILivestockRepository
    {
        Task<IEnumerable<Livestock>> GetAllAsync();
        Task<Livestock?> GetByIdAsync(Guid id);
        Task<Livestock> CreateAsync(Livestock livestock);
        Task<Livestock> UpdateAsync(Livestock livestock);
        Task<bool> DeleteAsync(Guid id);
    }
}
