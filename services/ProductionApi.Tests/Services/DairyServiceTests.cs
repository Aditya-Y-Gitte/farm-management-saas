using System;
using System.Threading.Tasks;
using FarmManagement.SharedKernel.Exceptions;
using Microsoft.Extensions.Logging;
using Moq;
using ProductionApi.DTOs;
using ProductionApi.Models;
using ProductionApi.Repositories;
using ProductionApi.Services;
using Xunit;

namespace ProductionApi.Tests.Services
{
    public class DairyServiceTests
    {
        private readonly Mock<IDairyRepository> _mockRepo;
        private readonly Mock<IDateTimeService> _mockDateTime;
        private readonly Mock<ILogger<DairyService>> _mockLogger;
        private readonly DairyService _service;

        public DairyServiceTests()
        {
            _mockRepo = new Mock<IDairyRepository>();
            _mockDateTime = new Mock<IDateTimeService>();
            _mockLogger = new Mock<ILogger<DairyService>>();
            _service = new DairyService(_mockRepo.Object, _mockDateTime.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task CreateAsync_ValidSession_CreatesAndReturnsDto()
        {
            var request = new CreateDairyRequest
            {
                LivestockId = Guid.NewGuid(),
                Date = new DateTime(2026, 8, 14),
                Session = "Morning",
                MilkYield = 15.5m,
                ProteinContent = 3.2m
            };

            _mockRepo.Setup(r => r.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session))
                .ReturnsAsync((Dairy?)null);

            _mockRepo.Setup(r => r.CreateAsync(It.IsAny<Dairy>()))
                .ReturnsAsync((Dairy d) => { d.Id = Guid.NewGuid(); return d; });

            var result = await _service.CreateAsync(request);

            Assert.NotNull(result);
            Assert.Equal(request.LivestockId, result.LivestockId);
            Assert.Equal(request.ProteinContent, result.ProteinContent);
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<Dairy>()), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_DuplicateLivestockDateAndSession_ThrowsConflictException()
        {
            var request = new CreateDairyRequest
            {
                LivestockId = Guid.NewGuid(),
                Date = new DateTime(2026, 8, 14),
                Session = "Morning"
            };

            _mockRepo.Setup(r => r.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session))
                .ReturnsAsync(new Dairy { LivestockId = request.LivestockId, Date = request.Date, Session = request.Session });

            await Assert.ThrowsAsync<ConflictException>(() => _service.CreateAsync(request));
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<Dairy>()), Times.Never);
        }

        [Fact]
        public async Task CreateAsync_SameLivestockDateDifferentSession_Allowed()
        {
            var request = new CreateDairyRequest
            {
                LivestockId = Guid.NewGuid(),
                Date = new DateTime(2026, 8, 14),
                Session = "Evening"
            };

            // Existing is "Morning", so for "Evening", it returns null
            _mockRepo.Setup(r => r.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session))
                .ReturnsAsync((Dairy?)null);

            _mockRepo.Setup(r => r.CreateAsync(It.IsAny<Dairy>()))
                .ReturnsAsync((Dairy d) => { d.Id = Guid.NewGuid(); return d; });

            var result = await _service.CreateAsync(request);

            Assert.NotNull(result);
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<Dairy>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_UpdateSameRecordWithoutChangingUniqueCombination_Success()
        {
            var id = Guid.NewGuid();
            var livestockId = Guid.NewGuid();
            var date = new DateTime(2026, 8, 14);
            var session = "Morning";

            var existingEntity = new Dairy { Id = id, LivestockId = livestockId, Date = date, Session = session, MilkYield = 10m };
            var request = new UpdateDairyRequest { LivestockId = livestockId, Date = date, Session = session, MilkYield = 12m };

            _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingEntity);
            _mockRepo.Setup(r => r.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session))
                .ReturnsAsync(existingEntity); // Returns itself

            _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<Dairy>())).ReturnsAsync((Dairy d) => d);

            var result = await _service.UpdateAsync(id, request);

            Assert.NotNull(result);
            Assert.Equal(12m, result.MilkYield);
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Dairy>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ChangeToAnotherExistingCombination_ThrowsConflictException()
        {
            var id = Guid.NewGuid();
            var existingEntity = new Dairy { Id = id, LivestockId = Guid.NewGuid(), Date = new DateTime(2026, 8, 14), Session = "Evening" };
            var request = new UpdateDairyRequest { LivestockId = existingEntity.LivestockId, Date = existingEntity.Date, Session = "Morning" };

            var otherExistingEntity = new Dairy { Id = Guid.NewGuid(), LivestockId = existingEntity.LivestockId, Date = existingEntity.Date, Session = "Morning" };

            _mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingEntity);
            _mockRepo.Setup(r => r.GetByLivestockDateAndSessionAsync(request.LivestockId, request.Date, request.Session))
                .ReturnsAsync(otherExistingEntity); // Conflict! Another ID owns this combination

            await Assert.ThrowsAsync<ConflictException>(() => _service.UpdateAsync(id, request));
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Dairy>()), Times.Never);
        }
    }
}
