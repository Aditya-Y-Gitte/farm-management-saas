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

    public async Task<(IEnumerable<Dairy> Items, int TotalCount)> GetAllAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null, Guid? livestockId = null, string? session = null)
    {
        var query = _context.Dairies.AsNoTracking();

        if (startDate.HasValue)
        {
            query = query.Where(d => d.Date >= startDate.Value);
        }
        if (endDate.HasValue)
        {
            query = query.Where(d => d.Date < endDate.Value);
        }
        if (livestockId.HasValue)
        {
            query = query.Where(d => d.LivestockId == livestockId.Value);
        }
        if (!string.IsNullOrEmpty(session))
        {
            query = query.Where(d => d.Session == session);
        }

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

    public async Task<Dairy?> GetByLivestockDateAndSessionAsync(Guid livestockId, DateTime date, string session)
    {
        return await _context.Dairies.AsNoTracking()
            .FirstOrDefaultAsync(d => d.LivestockId == livestockId && d.Date.Date == date.Date && d.Session == session);
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

    public async Task<DairySummaryDto> GetSummaryAsync(DateTime todayStartUtc, DateTime todayEndUtc, DateTime weekStartUtc, DateTime weekEndUtc, Guid? livestockId = null)
    {
        var query = _context.Dairies.AsNoTracking();
        if (livestockId.HasValue)
        {
            query = query.Where(d => d.LivestockId == livestockId.Value);
        }

        var totalRecords = await query.CountAsync();
        var todayMilk = await query
            .Where(d => d.Date >= todayStartUtc && d.Date < todayEndUtc)
            .SumAsync(d => d.MilkYield);
        var weekMilk = await query
            .Where(d => d.Date >= weekStartUtc && d.Date < weekEndUtc)
            .SumAsync(d => d.MilkYield);
        var avgFat = totalRecords > 0
            ? await query.AverageAsync(d => d.FatContent)
            : 0;
        var avgSnf = totalRecords > 0
            ? await query.AverageAsync(d => d.SnfContent)
            : 0;

        return new DairySummaryDto
        {
            TotalMilkToday = todayMilk,
            TotalMilkThisWeek = weekMilk,
            TotalRecords = totalRecords,
            AverageFatContent = avgFat,
            AverageSnfContent = avgSnf
        };
    }

    public async Task<(IEnumerable<Dairy> Items, int TotalCount)> GetByLivestockIdAsync(Guid livestockId, int page, int pageSize)
    {
        var query = _context.Dairies.AsNoTracking().Where(d => d.LivestockId == livestockId);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(d => d.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<IEnumerable<DairyTrendPointDto>> GetTrendsAsync(DateTime startDate, DateTime endDate, Guid? livestockId = null, string? session = null)
    {
        var query = _context.Dairies.AsNoTracking()
            .Where(d => d.Date >= startDate && d.Date < endDate);

        if (livestockId.HasValue)
        {
            query = query.Where(d => d.LivestockId == livestockId.Value);
        }
        if (!string.IsNullOrEmpty(session))
        {
            query = query.Where(d => d.Session == session);
        }

        var points = await query
            .GroupBy(d => d.Date.Date)
            .Select(g => new DairyTrendPointDto
            {
                Date = g.Key,
                TotalMilk = g.Sum(d => d.MilkYield),
                AverageFat = g.Average(d => d.FatContent),
                AverageProtein = g.Average(d => d.ProteinContent),
                AverageSnf = g.Average(d => d.SnfContent)
            })
            .OrderBy(p => p.Date)
            .ToListAsync();

        return points;
    }

    public async Task<IEnumerable<Dairy>> GetRecentYieldsAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Dairies
            .AsNoTracking()
            .Where(d => d.Date >= startDate && d.Date < endDate)
            .ToListAsync();
    }
}
