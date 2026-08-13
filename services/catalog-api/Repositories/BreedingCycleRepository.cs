using CatalogApi.Data;
using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Repositories;

public class BreedingCycleRepository : IBreedingCycleRepository
{
    private readonly CatalogDbContext _context;

    public BreedingCycleRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<BreedingCycle> Items, int TotalCount)> GetAllAsync(int page, int pageSize)
    {
        var query = _context.BreedingCycles.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(b => b.BreedingDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(IEnumerable<BreedingCycle> Items, int TotalCount)> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize)
    {
        var query = _context.BreedingCycles.AsNoTracking().Where(b => b.LivestockId == livestockId);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(b => b.BreedingDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<BreedingCycle?> GetByIdAsync(Guid id)
    {
        return await _context.BreedingCycles.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<BreedingCycle> CreateAsync(BreedingCycle record)
    {
        _context.BreedingCycles.Add(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<BreedingCycle> UpdateAsync(BreedingCycle record)
    {
        _context.Entry(record).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var record = await _context.BreedingCycles.FindAsync(id);
        if (record is null) return false;

        _context.BreedingCycles.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }
}
