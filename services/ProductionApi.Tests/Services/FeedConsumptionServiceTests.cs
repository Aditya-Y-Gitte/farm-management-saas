using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FarmManagement.SharedKernel.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ProductionApi.Data;
using ProductionApi.DTOs;
using ProductionApi.Models;
using ProductionApi.Repositories;
using ProductionApi.Services;
using Xunit;

namespace ProductionApi.Tests.Services
{
    public class FeedConsumptionServiceTests : IDisposable
    {
        private readonly DbContextOptions<ProductionDbContext> _options;
        private readonly ProductionDbContext _context;
        private readonly FeedConsumptionService _service;

        public FeedConsumptionServiceTests()
        {
            _options = new DbContextOptionsBuilder<ProductionDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim("tenant_id", "tenant-1") };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims));
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);

            _context = new ProductionDbContext(_options, mockHttpContextAccessor.Object);
            
            var repo = new FeedConsumptionRepository(_context);
            var logger = new Mock<ILogger<FeedConsumptionService>>().Object;
            
            _service = new FeedConsumptionService(repo, logger);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task CreateAsync_IndividualFeed_Succeeds_AndStampsTenantId()
        {
            var livestockId = Guid.NewGuid();
            var request = new CreateFeedConsumptionRequest
            {
                LivestockId = livestockId,
                Date = DateTime.UtcNow,
                FeedType = FeedType.DryFodder,
                Quantity = 10,
                Unit = FeedUnit.Kg
            };

            var result = await _service.CreateAsync(request);

            Assert.NotNull(result);
            Assert.Equal(livestockId, result.LivestockId);
            
            var entityInDb = await _context.FeedConsumptions.IgnoreQueryFilters().FirstOrDefaultAsync(i => i.Id == result.Id);
            Assert.NotNull(entityInDb);
            Assert.Equal("tenant-1", entityInDb.TenantId);
        }
        
        [Fact]
        public async Task CreateAsync_HerdFeed_Succeeds_WithNullLivestockId()
        {
            var request = new CreateFeedConsumptionRequest
            {
                LivestockId = null,
                Date = DateTime.UtcNow,
                FeedType = FeedType.GreenFodder,
                Quantity = 50,
                Unit = FeedUnit.Bale
            };

            var result = await _service.CreateAsync(request);

            Assert.NotNull(result);
            Assert.Null(result.LivestockId);
        }

        [Fact]
        public async Task GetAllAsync_FiltersByLivestockId()
        {
            var livestockId1 = Guid.NewGuid();
            var livestockId2 = Guid.NewGuid();
            
            _context.FeedConsumptions.Add(new FeedConsumption { Id = Guid.NewGuid(), LivestockId = livestockId1, Date = DateTime.UtcNow, FeedType = FeedType.GreenFodder, Quantity = 10, Unit = FeedUnit.Kg });
            _context.FeedConsumptions.Add(new FeedConsumption { Id = Guid.NewGuid(), LivestockId = livestockId1, Date = DateTime.UtcNow, FeedType = FeedType.GreenFodder, Quantity = 10, Unit = FeedUnit.Kg });
            _context.FeedConsumptions.Add(new FeedConsumption { Id = Guid.NewGuid(), LivestockId = livestockId2, Date = DateTime.UtcNow, FeedType = FeedType.GreenFodder, Quantity = 10, Unit = FeedUnit.Kg });
            _context.FeedConsumptions.Add(new FeedConsumption { Id = Guid.NewGuid(), LivestockId = null, Date = DateTime.UtcNow, FeedType = FeedType.GreenFodder, Quantity = 10, Unit = FeedUnit.Kg });
            await _context.SaveChangesAsync();

            var result = await _service.GetAllAsync(1, 10, livestockId: livestockId1);

            Assert.Equal(2, result.TotalCount);
        }

        private async Task<FeedConsumption> SeedFeedForTenant(string tenantId)
        {
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim("tenant_id", tenantId) };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims));
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);

            using var seedContext = new ProductionDbContext(_options, mockHttpContextAccessor.Object);
            var feed = new FeedConsumption { Id = Guid.NewGuid(), Date = DateTime.UtcNow, FeedType = FeedType.GreenFodder, Quantity = 10, Unit = FeedUnit.Kg };
            seedContext.FeedConsumptions.Add(feed);
            await seedContext.SaveChangesAsync();
            return feed;
        }

        [Fact]
        public async Task GetByIdAsync_CrossTenant_ReturnsNull()
        {
            var otherTenantFeed = await SeedFeedForTenant("tenant-2");
            var result = await _service.GetByIdAsync(otherTenantFeed.Id);
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_CrossTenant_ThrowsNotFoundException()
        {
            var otherTenantFeed = await SeedFeedForTenant("tenant-2");
            var request = new UpdateFeedConsumptionRequest { Date = DateTime.UtcNow, FeedType = FeedType.GreenFodder, Quantity = 20, Unit = FeedUnit.Kg };

            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateAsync(otherTenantFeed.Id, request));
        }

        [Fact]
        public async Task DeleteAsync_CrossTenant_ReturnsFalse()
        {
            var otherTenantFeed = await SeedFeedForTenant("tenant-2");
            var result = await _service.DeleteAsync(otherTenantFeed.Id);
            Assert.False(result);
        }
    }
}
