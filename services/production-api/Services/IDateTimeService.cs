namespace ProductionApi.Services;

/// <summary>
/// Provides date/time boundary calculations for business logic.
/// Currently defaults to UTC boundaries, but is centralized here
/// so that tenant-local timezones can be introduced later without rewriting logic.
/// </summary>
public interface IDateTimeService
{
    /// <summary>
    /// Returns the start (inclusive) and end (exclusive) UTC boundaries for "Today".
    /// </summary>
    (DateTime StartUtc, DateTime EndUtc) GetTodayBoundariesUtc();
    
    /// <summary>
    /// Returns the start (inclusive) and end (exclusive) UTC boundaries for "This Week".
    /// </summary>
    (DateTime StartUtc, DateTime EndUtc) GetThisWeekBoundariesUtc();
}
