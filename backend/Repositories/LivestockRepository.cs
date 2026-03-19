using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class LivestockRepository : ILivestockRepository
    {
        private readonly ApplicationDbContext _context;

        public LivestockRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Livestock> CreateAsync(Livestock livestock)
        {
            _context.Livestocks.Add(livestock);
            await _context.SaveChangesAsync();
            return livestock;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var livestock = await _context.Livestocks.FindAsync(id);
            if (livestock == null)
            {
                return false;
            }

            _context.Livestocks.Remove(livestock);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Livestock>> GetAllAsync()
        {
            return await _context.Livestocks.ToListAsync();
        }

        public async Task<Livestock?> GetByIdAsync(Guid id)
        {
            return await _context.Livestocks.FindAsync(id);
        }

        public async Task<Livestock> UpdateAsync(Livestock livestock)
        {
            _context.Entry(livestock).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return livestock;
        }
    }
}
