using CatalogApi.Data;
using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Repositories;

public class LivestockRepository : ILivestockRepository
{
    private readonly CatalogDbContext _context;

    public LivestockRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Livestock> Items, int TotalCount)> GetAllAsync(int page, int pageSize)
    {
        var query = _context.Livestocks.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Livestock?> GetByIdAsync(Guid id)
    {
        return await _context.Livestocks.AsNoTracking().FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<Livestock?> GetByNameAsync(string name)
    {
        return await _context.Livestocks.AsNoTracking().FirstOrDefaultAsync(l => l.Name == name);
    }

    public async Task<Livestock?> GetByTagNumberAsync(string tagNumber)
    {
        return await _context.Livestocks.AsNoTracking().FirstOrDefaultAsync(l => l.TagNumber == tagNumber);
    }

    public async Task<Livestock> CreateAsync(Livestock livestock)
    {
        _context.Livestocks.Add(livestock);
        await _context.SaveChangesAsync();
        return livestock;
    }

    public async Task<Livestock> UpdateAsync(Livestock livestock)
    {
        _context.Entry(livestock).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return livestock;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var livestock = await _context.Livestocks.FindAsync(id);
        if (livestock == null) return false;

        _context.Livestocks.Remove(livestock);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Livestock>> GetAttentionAsync(int limit)
    {
        // Custom order: Sick before Needs Attention
        return await _context.Livestocks
            .AsNoTracking()
            .Where(l => LivestockStatuses.RequiringAttention.Contains(l.Status))
            .OrderBy(l => l.Status == "Sick" ? 0 : 1)
            .ThenByDescending(l => l.UpdatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<CatalogApi.DTOs.CatalogSummaryDto> GetSummaryAsync()
    {
        var query = _context.Livestocks.AsNoTracking();
        var total = await query.CountAsync();
        var attention = await query.CountAsync(l => LivestockStatuses.RequiringAttention.Contains(l.Status));

        return new CatalogApi.DTOs.CatalogSummaryDto
        {
            TotalLivestock = total,
            AttentionCount = attention
        };
    }
}
