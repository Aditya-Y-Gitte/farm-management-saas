using System;
using System.Threading.Tasks;
using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;
using CatalogApi.Services;
using FarmManagement.SharedKernel.Exceptions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CatalogApi.Tests.Services
{
    public class BreedingCycleServiceTests
    {
        private readonly Mock<IBreedingCycleRepository> _mockRepo;
        private readonly Mock<ILivestockRepository> _mockLivestockRepo;
        private readonly Mock<ILogger<BreedingCycleService>> _mockLogger;
        private readonly BreedingCycleService _service;

        public BreedingCycleServiceTests()
        {
            _mockRepo = new Mock<IBreedingCycleRepository>();
            _mockLivestockRepo = new Mock<ILivestockRepository>();
            _mockLogger = new Mock<ILogger<BreedingCycleService>>();
            _service = new BreedingCycleService(_mockRepo.Object, _mockLivestockRepo.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task CreateAsync_ValidLivestock_CreatesRecord()
        {
            var request = new CreateBreedingCycleRequest
            {
                LivestockId = Guid.NewGuid(),
                BreedingDate = new DateTime(2026, 1, 1),
                Method = BreedingMethod.ArtificialInsemination,
                Status = BreedingStatus.Inseminated
            };

            _mockLivestockRepo.Setup(r => r.GetByIdAsync(request.LivestockId))
                .ReturnsAsync(new Livestock { Id = request.LivestockId, TenantId = "tenant-1" });

            _mockRepo.Setup(r => r.CreateAsync(It.IsAny<BreedingCycle>()))
                .ReturnsAsync((BreedingCycle b) => { b.Id = Guid.NewGuid(); return b; });

            var result = await _service.CreateAsync(request);

            Assert.NotNull(result);
            Assert.Equal(request.Status, result.Status);
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<BreedingCycle>()), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_LivestockNotFoundOrDifferentTenant_ThrowsNotFoundException()
        {
            var request = new CreateBreedingCycleRequest { LivestockId = Guid.NewGuid() };

            _mockLivestockRepo.Setup(r => r.GetByIdAsync(request.LivestockId))
                .ReturnsAsync((Livestock?)null); // Simulates filter exclusion for tenant

            await Assert.ThrowsAsync<NotFoundException>(() => _service.CreateAsync(request));
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<BreedingCycle>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_Valid_UpdatesRecord()
        {
            var id = Guid.NewGuid();
            var existingRecord = new BreedingCycle { Id = id, LivestockId = Guid.NewGuid(), Status = BreedingStatus.Inseminated };
            var request = new UpdateBreedingCycleRequest { LivestockId = existingRecord.LivestockId, Status = BreedingStatus.Pregnant };

            _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingRecord);
            _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<BreedingCycle>())).ReturnsAsync((BreedingCycle b) => b);

            var result = await _service.UpdateAsync(id, request);

            Assert.Equal(BreedingStatus.Pregnant, result.Status);
            _mockLivestockRepo.Verify(r => r.GetByIdAsync(It.IsAny<Guid>()), Times.Never); // Not changing LivestockId
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<BreedingCycle>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ChangeToInvalidLivestock_ThrowsNotFoundException()
        {
            var id = Guid.NewGuid();
            var existingRecord = new BreedingCycle { Id = id, LivestockId = Guid.NewGuid(), Status = BreedingStatus.Inseminated };
            var request = new UpdateBreedingCycleRequest { LivestockId = Guid.NewGuid(), Status = BreedingStatus.Pregnant };

            _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingRecord);
            _mockLivestockRepo.Setup(r => r.GetByIdAsync(request.LivestockId)).ReturnsAsync((Livestock?)null);

            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateAsync(id, request));
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<BreedingCycle>()), Times.Never);
        }
    }
}
