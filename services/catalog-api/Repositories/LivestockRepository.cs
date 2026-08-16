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

    public async Task<(IEnumerable<Livestock> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? search = null, string? species = null, string? status = null)
    {
        var query = _context.Livestocks.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(l => (l.Name != null && l.Name.ToLower().Contains(searchLower)) || 
                                     (l.TagNumber != null && l.TagNumber.ToLower().Contains(searchLower)));
        }

        if (!string.IsNullOrWhiteSpace(species) && species != "ALL")
        {
            query = query.Where(l => l.Species == species);
        }

        if (!string.IsNullOrWhiteSpace(status) && status != "ALL")
        {
            query = query.Where(l => l.Status == status);
        }

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

    public async Task<IEnumerable<CatalogApi.DTOs.CatalogAlertDto>> GetAlertsAsync(int limit)
    {
        var attentionAnimals = await _context.Livestocks
            .AsNoTracking()
            .Where(l => LivestockStatuses.RequiringAttention.Contains(l.Status))
            .OrderBy(l => l.Status == LivestockStatuses.Sick ? 0 : 1)
            .ThenByDescending(l => l.UpdatedAt)
            .Take(limit)
            .ToListAsync();

        return attentionAnimals.Select(l => new CatalogApi.DTOs.CatalogAlertDto
        {
            LivestockId = l.Id,
            AlertType = l.Status == LivestockStatuses.Sick ? "LivestockSick" : "LivestockNeedsAttention",
            Date = DateTime.UtcNow // Catalog alerts are usually real-time based on current status
        });
    }

    public async Task<IEnumerable<Livestock>> GetByIdsAsync(IEnumerable<Guid> ids)
    {
        return await _context.Livestocks
            .AsNoTracking()
            .Where(l => ids.Contains(l.Id))
            .ToListAsync();
    }

    public async Task<CatalogApi.DTOs.CatalogSummaryDto> GetSummaryAsync()
    {
        var summaryData = await _context.Livestocks.AsNoTracking()
            .GroupBy(l => l.Species)
            .Select(g => new
            {
                Species = g.Key,
                Total = g.Count(),
                Attention = g.Count(l => LivestockStatuses.RequiringAttention.Contains(l.Status))
            })
            .ToListAsync();

        return new CatalogApi.DTOs.CatalogSummaryDto
        {
            TotalLivestock = summaryData.Sum(s => s.Total),
            AttentionCount = summaryData.Sum(s => s.Attention),
            SpeciesDistribution = summaryData.ToDictionary(s => s.Species, s => s.Total)
        };
    }
}
