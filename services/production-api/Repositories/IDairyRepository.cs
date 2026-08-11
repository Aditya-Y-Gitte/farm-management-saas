using ProductionApi.Models;

namespace ProductionApi.Repositories;

public interface IDairyRepository
{
    Task<(IEnumerable<Dairy> Items, int TotalCount)> GetAllAsync(int page, int pageSize);
    Task<Dairy?> GetByIdAsync(Guid id);
    Task<Dairy?> GetByLivestockIdAndDateAsync(Guid livestockId, DateTime date);
    Task<Dairy> CreateAsync(Dairy dairy);
    Task<Dairy> UpdateAsync(Dairy dairy);
    Task<bool> DeleteAsync(Guid id);
    Task<DairySummary> GetSummaryAsync();
}

public class DairySummary
{
    public decimal TotalMilkToday { get; set; }
    public decimal TotalMilkThisWeek { get; set; }
    public int TotalRecords { get; set; }
    public decimal AverageFatContent { get; set; }
    public decimal AverageProteinContent { get; set; }
}
