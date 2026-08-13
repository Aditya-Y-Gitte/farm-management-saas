using CatalogApi.Data;
using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Repositories;

public class HealthRecordRepository : IHealthRecordRepository
{
    private readonly CatalogDbContext _context;

    public HealthRecordRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<HealthRecord> Items, int TotalCount)> GetAllAsync(int page, int pageSize)
    {
        var query = _context.HealthRecords.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(h => h.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(IEnumerable<HealthRecord> Items, int TotalCount)> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize)
    {
        var query = _context.HealthRecords.AsNoTracking().Where(h => h.LivestockId == livestockId);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(h => h.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<HealthRecord?> GetByIdAsync(Guid id)
    {
        return await _context.HealthRecords.AsNoTracking().FirstOrDefaultAsync(h => h.Id == id);
    }

    public async Task<HealthRecord> CreateAsync(HealthRecord record)
    {
        _context.HealthRecords.Add(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<HealthRecord> UpdateAsync(HealthRecord record)
    {
        _context.Entry(record).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var record = await _context.HealthRecords.FindAsync(id);
        if (record is null) return false;

        _context.HealthRecords.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }
}
