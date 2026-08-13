using System;
using System.Collections.Generic;
using System.Linq;
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
    public class HealthRecordServiceTests
    {
        private readonly Mock<IHealthRecordRepository> _mockRepo;
        private readonly Mock<ILivestockRepository> _mockLivestockRepo;
        private readonly Mock<ILogger<HealthRecordService>> _mockLogger;
        private readonly HealthRecordService _service;

        public HealthRecordServiceTests()
        {
            _mockRepo = new Mock<IHealthRecordRepository>();
            _mockLivestockRepo = new Mock<ILivestockRepository>();
            _mockLogger = new Mock<ILogger<HealthRecordService>>();
            _service = new HealthRecordService(_mockRepo.Object, _mockLivestockRepo.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task CreateAsync_ValidLivestock_CreatesRecord()
        {
            var request = new CreateHealthRecordRequest
            {
                LivestockId = Guid.NewGuid(),
                Date = DateTime.UtcNow,
                Type = "Vaccination",
                Description = "Annual vaccination",
                Veterinarian = "Dr. Smith"
            };

            // Setup livestock exists (tenant filter applied implicitly by repo returning not-null)
            _mockLivestockRepo.Setup(r => r.GetByIdAsync(request.LivestockId))
                .ReturnsAsync(new Livestock { Id = request.LivestockId, TenantId = "tenant-1" });

            _mockRepo.Setup(r => r.CreateAsync(It.IsAny<HealthRecord>()))
                .ReturnsAsync((HealthRecord h) => { h.Id = Guid.NewGuid(); return h; });

            var result = await _service.CreateAsync(request);

            Assert.NotNull(result);
            Assert.Equal(request.Type, result.Type);
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<HealthRecord>()), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_LivestockNotFoundOrDifferentTenant_ThrowsNotFoundException()
        {
            var request = new CreateHealthRecordRequest { LivestockId = Guid.NewGuid() };

            _mockLivestockRepo.Setup(r => r.GetByIdAsync(request.LivestockId))
                .ReturnsAsync((Livestock?)null);

            await Assert.ThrowsAsync<NotFoundException>(() => _service.CreateAsync(request));
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<HealthRecord>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_Valid_UpdatesRecord()
        {
            var id = Guid.NewGuid();
            var existingRecord = new HealthRecord { Id = id, LivestockId = Guid.NewGuid(), Type = "Old" };
            var request = new UpdateHealthRecordRequest { LivestockId = existingRecord.LivestockId, Type = "New" };

            _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingRecord);
            _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<HealthRecord>())).ReturnsAsync((HealthRecord h) => h);

            var result = await _service.UpdateAsync(id, request);

            Assert.Equal("New", result.Type);
            _mockLivestockRepo.Verify(r => r.GetByIdAsync(It.IsAny<Guid>()), Times.Never); // Not changing LivestockId
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<HealthRecord>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ChangeToInvalidLivestock_ThrowsNotFoundException()
        {
            var id = Guid.NewGuid();
            var existingRecord = new HealthRecord { Id = id, LivestockId = Guid.NewGuid(), Type = "Old" };
            var request = new UpdateHealthRecordRequest { LivestockId = Guid.NewGuid(), Type = "New" };

            _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingRecord);
            _mockLivestockRepo.Setup(r => r.GetByIdAsync(request.LivestockId)).ReturnsAsync((Livestock?)null);

            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateAsync(id, request));
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<HealthRecord>()), Times.Never);
        }
    }
}
