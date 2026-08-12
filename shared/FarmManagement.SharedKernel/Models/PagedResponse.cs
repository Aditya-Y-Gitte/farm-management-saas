namespace FarmManagement.SharedKernel.Models;

/// <summary>
/// Universal paginated response contract used across all microservices.
/// This is a pure data shape with no business logic — safe to share in SharedKernel.
/// Services that need custom pagination behavior may define their own types.
/// </summary>
public class PagedResponse<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => PageSize > 0
        ? (int)Math.Ceiling((double)TotalCount / PageSize)
        : 0;

    public static PagedResponse<T> Create(IEnumerable<T> items, int totalCount, int page, int pageSize)
    {
        return new PagedResponse<T>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
}
