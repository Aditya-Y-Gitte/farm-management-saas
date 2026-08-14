namespace ProductionApi.Services;

public class DateTimeService : IDateTimeService
{
    public (DateTime StartUtc, DateTime EndUtc) GetTodayBoundariesUtc()
    {
        // For now, tenant timezone is not implemented, so we use UTC calendar day.
        var today = DateTime.UtcNow.Date;
        return (today, today.AddDays(1));
    }

    public (DateTime StartUtc, DateTime EndUtc) GetThisWeekBoundariesUtc()
    {
        var today = DateTime.UtcNow.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        return (weekStart, today.AddDays(1));
    }
}
