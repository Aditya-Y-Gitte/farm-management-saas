using FarmManagement.SharedKernel.Models;
using Microsoft.EntityFrameworkCore;
using ProductionApi.Data;
using ProductionApi.Models;

namespace ProductionApi.Repositories;

public class FeedConsumptionRepository : IFeedConsumptionRepository
{
    private readonly ProductionDbContext _context;

    public FeedConsumptionRepository(ProductionDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<FeedConsumption> Items, int TotalCount)> GetAllAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null, Guid? livestockId = null)
    {
        var query = _context.FeedConsumptions.AsNoTracking();

        if (startDate.HasValue)
            query = query.Where(f => f.Date >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(f => f.Date <= endDate.Value);
            
        if (livestockId.HasValue)
            query = query.Where(f => f.LivestockId == livestockId.Value);

        query = query.OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return (items, totalCount);
    }

    public async Task<FeedConsumption?> GetByIdAsync(Guid id)
    {
        return await _context.FeedConsumptions.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<FeedConsumption> CreateAsync(FeedConsumption feedConsumption)
    {
        _context.FeedConsumptions.Add(feedConsumption);
        await _context.SaveChangesAsync();
        return feedConsumption;
    }

    public async Task<FeedConsumption> UpdateAsync(FeedConsumption feedConsumption)
    {
        _context.FeedConsumptions.Update(feedConsumption);
        await _context.SaveChangesAsync();
        return feedConsumption;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context.FeedConsumptions.FirstOrDefaultAsync(f => f.Id == id);
        if (entity == null) return false;

        _context.FeedConsumptions.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
