using ProductionApi.Data;
using ProductionApi.DTOs;
using ProductionApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductionApi.Repositories;

/// <summary>
/// EF Core implementation of the Dairy repository.
/// Works on domain models (Dairy). Returns DairySummaryDto for aggregate queries
/// because these are projections with no entity identity.
/// </summary>
public class DairyRepository : IDairyRepository
{
    private readonly ProductionDbContext _context;

    public DairyRepository(ProductionDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Dairy> Items, int TotalCount)> GetAllAsync(int page, int pageSize)
    {
        var query = _context.Dairies.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(d => d.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Dairy?> GetByIdAsync(Guid id)
    {
        return await _context.Dairies.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date)
    {
        return await _context.Dairies.AsNoTracking()
            .FirstOrDefaultAsync(d => d.LivestockId == livestockId && d.Date.Date == date.Date);
    }

    public async Task<Dairy> CreateAsync(Dairy dairy)
    {
        _context.Dairies.Add(dairy);
        await _context.SaveChangesAsync();
        return dairy;
    }

    public async Task<Dairy> UpdateAsync(Dairy dairy)
    {
        _context.Entry(dairy).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return dairy;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var dairy = await _context.Dairies.FindAsync(id);
        if (dairy is null) return false;

        _context.Dairies.Remove(dairy);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DairySummaryDto> GetSummaryAsync()
    {
        var today = DateTime.UtcNow.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        var query = _context.Dairies.AsNoTracking();

        var totalRecords = await query.CountAsync();
        var todayMilk = await query
            .Where(d => d.Date.Date == today)
            .SumAsync(d => d.MilkYield);
        var weekMilk = await query
            .Where(d => d.Date.Date >= weekStart)
            .SumAsync(d => d.MilkYield);
        var avgFat = totalRecords > 0
            ? await query.AverageAsync(d => d.FatContent)
            : 0;
        var avgProtein = totalRecords > 0
            ? await query.AverageAsync(d => d.ProteinContent)
            : 0;

        return new DairySummaryDto
        {
            TotalMilkToday = todayMilk,
            TotalMilkThisWeek = weekMilk,
            TotalRecords = totalRecords,
            AverageFatContent = avgFat,
            AverageProteinContent = avgProtein
        };
    }
}
