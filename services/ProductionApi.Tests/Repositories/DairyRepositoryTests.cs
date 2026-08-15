using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using ProductionApi.Data;
using ProductionApi.Models;
using ProductionApi.Repositories;
using System.Security.Claims;

namespace ProductionApi.Tests.Repositories;

public class DairyRepositoryTests : IDisposable
{
    private readonly ProductionDbContext _context;
    private readonly DairyRepository _repository;
    private readonly string _tenantId = Guid.NewGuid().ToString();
    private readonly string _otherTenantId = Guid.NewGuid().ToString();
    private readonly Guid _livestockId1 = Guid.NewGuid();
    private readonly Guid _livestockId2 = Guid.NewGuid();

    public DairyRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<ProductionDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        var claims = new[] { new Claim("tenant_id", _tenantId) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var user = new ClaimsPrincipal(identity);
        var httpContext = new DefaultHttpContext { User = user };
        httpContextAccessorMock.Setup(a => a.HttpContext).Returns(httpContext);

        _context = new ProductionDbContext(options, httpContextAccessorMock.Object);
        _repository = new DairyRepository(_context);
    }
    
    private async Task SeedDataAsync()
    {
        // Add records for current tenant
        _context.Dairies.AddRange(
            new Dairy { Id = Guid.NewGuid(), LivestockId = _livestockId1, Date = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc), Session = "Morning", MilkYield = 10m, FatContent = 4.0m, ProteinContent = 3.2m, SnfContent = 8.5m },
            new Dairy { Id = Guid.NewGuid(), LivestockId = _livestockId1, Date = new DateTime(2026, 8, 1, 12, 0, 0, DateTimeKind.Utc), Session = "Evening", MilkYield = 12m, FatContent = 4.2m, ProteinContent = 3.3m, SnfContent = 8.6m },
            new Dairy { Id = Guid.NewGuid(), LivestockId = _livestockId2, Date = new DateTime(2026, 8, 2, 0, 0, 0, DateTimeKind.Utc), Session = "Morning", MilkYield = 15m, FatContent = 3.8m, ProteinContent = 3.1m, SnfContent = 8.4m },
            new Dairy { Id = Guid.NewGuid(), LivestockId = _livestockId1, Date = new DateTime(2026, 8, 5, 0, 0, 0, DateTimeKind.Utc), Session = "Morning", MilkYield = 11m, FatContent = 4.1m, ProteinContent = 3.2m, SnfContent = 8.5m }
        );
        await _context.SaveChangesAsync();

        // Add records for another tenant directly to bypass query filters during insert (actually EF Core sets TenantId on Add based on current HttpContext, so we have to manually override it or use another context)
        // To properly test tenant isolation, we can create another context instance with a different tenantId
        var otherOptions = new DbContextOptionsBuilder<ProductionDbContext>()
            .UseInMemoryDatabase(databaseName: _context.Database.ProviderName!) // Wait, in-memory DB name is in options. But we can just change the mock
            .Options;
    }

    [Fact]
    public async Task GetAllAsync_AppliesStartDateFilter()
    {
        await SeedDataAsync();
        var startDate = new DateTime(2026, 8, 2, 0, 0, 0, DateTimeKind.Utc);
        
        var (items, count) = await _repository.GetAllAsync(1, 10, startDate: startDate);
        
        Assert.Equal(2, count);
        Assert.All(items, i => Assert.True(i.Date >= startDate));
    }

    [Fact]
    public async Task GetAllAsync_AppliesEndDateFilter()
    {
        await SeedDataAsync();
        var endDate = new DateTime(2026, 8, 2, 0, 0, 0, DateTimeKind.Utc); // exclusive
        
        var (items, count) = await _repository.GetAllAsync(1, 10, endDate: endDate);
        
        Assert.Equal(2, count);
        Assert.All(items, i => Assert.True(i.Date < endDate));
    }

    [Fact]
    public async Task GetAllAsync_AppliesDateRange()
    {
        await SeedDataAsync();
        var startDate = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc);
        var endDate = new DateTime(2026, 8, 3, 0, 0, 0, DateTimeKind.Utc);
        
        var (items, count) = await _repository.GetAllAsync(1, 10, startDate: startDate, endDate: endDate);
        
        Assert.Equal(3, count);
    }

    [Fact]
    public async Task GetAllAsync_AppliesLivestockFilter()
    {
        await SeedDataAsync();
        
        var (items, count) = await _repository.GetAllAsync(1, 10, livestockId: _livestockId2);
        
        Assert.Equal(1, count);
        Assert.Equal(_livestockId2, items.First().LivestockId);
    }

    [Fact]
    public async Task GetAllAsync_AppliesSessionFilter()
    {
        await SeedDataAsync();
        
        var (items, count) = await _repository.GetAllAsync(1, 10, session: "Evening");
        
        Assert.Equal(1, count);
        Assert.Equal("Evening", items.First().Session);
    }

    [Fact]
    public async Task GetTrendsAsync_AggregatesByDay()
    {
        await SeedDataAsync();
        var startDate = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc);
        var endDate = new DateTime(2026, 8, 3, 0, 0, 0, DateTimeKind.Utc);
        
        var trends = await _repository.GetTrendsAsync(startDate, endDate);
        
        Assert.Equal(2, trends.Count());
        
        var aug1 = trends.First(t => t.Date == new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc));
        Assert.Equal(22m, aug1.TotalMilk); // 10 + 12
        Assert.Equal(4.1m, aug1.AverageFat, 1); // (4.0 + 4.2) / 2
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
