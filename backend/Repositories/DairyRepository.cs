using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class DairyRepository : IDairyRepository
    {
        private readonly ApplicationDbContext _context;

        public DairyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Dairy> CreateAsync(Dairy dairy)
        {
            _context.Dairies.Add(dairy);
            await _context.SaveChangesAsync();
            return dairy;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var dairy = await _context.Dairies.FindAsync(id);
            if (dairy == null)
            {
                return false;
            }

            _context.Dairies.Remove(dairy);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Dairy>> GetAllAsync()
        {
            return await _context.Dairies.ToListAsync();
        }

        public async Task<Dairy?> GetByIdAsync(Guid id)
        {
            return await _context.Dairies.FindAsync(id);
        }

        public async Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date)
        {
            return await _context.Dairies.FirstOrDefaultAsync(d => d.LivestockId == livestockId && d.Date.Date == date.Date);
        }

        public async Task<Dairy> UpdateAsync(Dairy dairy)
        {
            _context.Entry(dairy).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return dairy;
        }
    }
}
