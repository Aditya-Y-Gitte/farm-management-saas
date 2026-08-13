using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FinanceApi.Data;
using FinanceApi.DTOs;
using FinanceApi.Models;
using FinanceApi.Services;
using FarmManagement.SharedKernel.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace FinanceApi.Tests.Services
{
    public class FinanceServiceTests : IDisposable
    {
        private readonly DbContextOptions<FinanceDbContext> _options;
        private readonly FinanceDbContext _context;
        private readonly FinanceService _service;

        public FinanceServiceTests()
        {
            _options = new DbContextOptionsBuilder<FinanceDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim("tenant_id", "tenant-1") };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims));
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);

            _context = new FinanceDbContext(_options, mockHttpContextAccessor.Object);
            _service = new FinanceService(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task CreateIncome_Succeeds_AndStampsTenantId()
        {
            var request = new CreateIncomeRequest
            {
                Date = DateTime.UtcNow,
                Category = IncomeCategory.MilkSale,
                Amount = 100.50m
            };

            var result = await _service.CreateIncomeAsync(request);

            Assert.NotNull(result);
            Assert.Equal(100.50m, result.Amount);
            
            var entityInDb = await _context.Incomes.IgnoreQueryFilters().FirstOrDefaultAsync(i => i.Id == result.Id);
            Assert.NotNull(entityInDb);
            Assert.Equal("tenant-1", entityInDb.TenantId);
        }

        [Fact]
        public async Task GetIncomes_FiltersByDateRange()
        {
            _context.Incomes.Add(new Income { Id = Guid.NewGuid(), Date = new DateTime(2026, 1, 1), Category = IncomeCategory.MilkSale, Amount = 100 });
            _context.Incomes.Add(new Income { Id = Guid.NewGuid(), Date = new DateTime(2026, 1, 15), Category = IncomeCategory.MilkSale, Amount = 200 });
            _context.Incomes.Add(new Income { Id = Guid.NewGuid(), Date = new DateTime(2026, 2, 1), Category = IncomeCategory.MilkSale, Amount = 300 });
            await _context.SaveChangesAsync();

            var result = await _service.GetIncomesAsync(1, 10, new DateTime(2026, 1, 1), new DateTime(2026, 1, 31));

            Assert.Equal(2, result.TotalCount);
        }

        private async Task<Income> SeedIncomeForTenant(string tenantId)
        {
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext();
            var claims = new List<Claim> { new Claim("tenant_id", tenantId) };
            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims));
            mockHttpContextAccessor.Setup(_ => _.HttpContext).Returns(context);

            using var seedContext = new FinanceDbContext(_options, mockHttpContextAccessor.Object);
            var income = new Income { Id = Guid.NewGuid(), Date = DateTime.UtcNow, Category = IncomeCategory.MilkSale, Amount = 500 };
            seedContext.Incomes.Add(income);
            await seedContext.SaveChangesAsync();
            return income;
        }

        [Fact]
        public async Task UpdateIncome_CrossTenant_ThrowsNotFoundException()
        {
            var otherTenantIncome = await SeedIncomeForTenant("tenant-2");
            var request = new UpdateIncomeRequest { Date = DateTime.UtcNow, Category = IncomeCategory.MilkSale, Amount = 600 };

            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateIncomeAsync(otherTenantIncome.Id, request));
        }

        [Fact]
        public async Task DeleteIncome_CrossTenant_ReturnsFalse()
        {
            var otherTenantIncome = await SeedIncomeForTenant("tenant-2");
            var result = await _service.DeleteIncomeAsync(otherTenantIncome.Id);
            Assert.False(result);
        }
    }
}
