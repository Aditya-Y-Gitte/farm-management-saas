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
    public class LivestockServiceTests
    {
        private readonly Mock<ILivestockRepository> _mockRepository;
        private readonly Mock<ILogger<LivestockService>> _mockLogger;
        private readonly LivestockService _service;

        public LivestockServiceTests()
        {
            _mockRepository = new Mock<ILivestockRepository>();
            _mockLogger = new Mock<ILogger<LivestockService>>();
            _service = new LivestockService(_mockRepository.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task CreateAsync_UniqueTagNumber_CreatesAndReturnsDto()
        {
            // Arrange
            var request = new CreateLivestockRequest
            {
                TagNumber = "TAG-001",
                Name = "Bessie",
                Species = "Cow"
            };

            _mockRepository.Setup(r => r.GetByTagNumberAsync(request.TagNumber))
                .ReturnsAsync((Livestock?)null);

            _mockRepository.Setup(r => r.CreateAsync(It.IsAny<Livestock>()))
                .ReturnsAsync((Livestock l) => 
                {
                    l.Id = Guid.NewGuid();
                    return l;
                });

            // Act
            var result = await _service.CreateAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(request.TagNumber, result.TagNumber);
            Assert.Equal(request.Name, result.Name);
            _mockRepository.Verify(r => r.CreateAsync(It.IsAny<Livestock>()), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_DuplicateTagNumber_ThrowsConflictException()
        {
            // Arrange
            var request = new CreateLivestockRequest
            {
                TagNumber = "TAG-001",
                Name = "Bessie",
                Species = "Cow"
            };

            _mockRepository.Setup(r => r.GetByTagNumberAsync(request.TagNumber))
                .ReturnsAsync(new Livestock { TagNumber = "TAG-001" });

            // Act & Assert
            await Assert.ThrowsAsync<ConflictException>(() => _service.CreateAsync(request));
            _mockRepository.Verify(r => r.CreateAsync(It.IsAny<Livestock>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_DuplicateTagNumber_ThrowsConflictException()
        {
            // Arrange
            var id = Guid.NewGuid();
            var existingEntity = new Livestock { Id = id, TagNumber = "TAG-OLD" };
            var request = new UpdateLivestockRequest { TagNumber = "TAG-NEW" };

            _mockRepository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingEntity);
            _mockRepository.Setup(r => r.GetByTagNumberAsync(request.TagNumber))
                .ReturnsAsync(new Livestock { TagNumber = "TAG-NEW" });

            // Act & Assert
            await Assert.ThrowsAsync<ConflictException>(() => _service.UpdateAsync(id, request));
            _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Livestock>()), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_ValidUpdate_UpdatesAndReturnsDto()
        {
            // Arrange
            var id = Guid.NewGuid();
            var existingEntity = new Livestock { Id = id, TagNumber = "TAG-OLD", Name = "Old Name" };
            var request = new UpdateLivestockRequest { TagNumber = "TAG-NEW", Name = "New Name" };

            _mockRepository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingEntity);
            _mockRepository.Setup(r => r.GetByTagNumberAsync(request.TagNumber)).ReturnsAsync((Livestock?)null);
            _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Livestock>()))
                .ReturnsAsync((Livestock l) => l);

            // Act
            var result = await _service.UpdateAsync(id, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("TAG-NEW", result.TagNumber);
            Assert.Equal("New Name", result.Name);
            _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Livestock>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_NotFound_ThrowsNotFoundException()
        {
            // Arrange
            var id = Guid.NewGuid();
            var request = new UpdateLivestockRequest { TagNumber = "TAG-NEW" };

            _mockRepository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Livestock?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateAsync(id, request));
        }
    }
}
