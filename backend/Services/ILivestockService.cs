using backend.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface ILivestockService
    {
        Task<IEnumerable<Livestock>> GetAllAsync();
        Task<Livestock?> GetByIdAsync(Guid id);
        Task<Livestock?> GetByNameAsync(string name);
        Task<Livestock> CreateAsync(Livestock livestock);
        Task<Livestock> UpdateAsync(Livestock livestock);
        Task<bool> DeleteAsync(Guid id);
    }
}
