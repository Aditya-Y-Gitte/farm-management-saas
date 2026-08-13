using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CatalogApi.Controllers;
using CatalogApi.DTOs;
using CatalogApi.Services;
using FarmManagement.SharedKernel.Exceptions;
using FarmManagement.SharedKernel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CatalogApi.Tests.Controllers
{
    public class LivestockControllerTests
    {
        private readonly Mock<ILivestockService> _mockService;
        private readonly Mock<ILogger<LivestockController>> _mockLogger;
        private readonly LivestockController _controller;

        public LivestockControllerTests()
        {
            _mockService = new Mock<ILivestockService>();
            _mockLogger = new Mock<ILogger<LivestockController>>();
            _controller = new LivestockController(_mockService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkWithPagedResponse()
        {
            // Arrange
            var dtos = new List<LivestockDto> { new LivestockDto { Id = Guid.NewGuid(), Name = "Bessie" } };
            var pagedResponse = PagedResponse<LivestockDto>.Create(dtos, 1, 1, 20);
            
            _mockService.Setup(s => s.GetAllAsync(1, 20)).ReturnsAsync(pagedResponse);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(pagedResponse, okResult.Value);
        }

        [Fact]
        public async Task GetById_ExistingId_ReturnsOk()
        {
            // Arrange
            var id = Guid.NewGuid();
            var dto = new LivestockDto { Id = id, Name = "Bessie" };
            _mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(dto);

            // Act
            var result = await _controller.GetById(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(dto, okResult.Value);
        }

        [Fact]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var id = Guid.NewGuid();
            _mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync((LivestockDto?)null);

            // Act
            var result = await _controller.GetById(id);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ValidRequest_ReturnsCreatedAtAction()
        {
            // Arrange
            var request = new CreateLivestockRequest { TagNumber = "TAG-123", Name = "Bessie", Species = "Cow" };
            var createdDto = new LivestockDto { Id = Guid.NewGuid(), TagNumber = "TAG-123", Name = "Bessie" };
            
            _mockService.Setup(s => s.CreateAsync(request)).ReturnsAsync(createdDto);

            // Act
            var result = await _controller.Create(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(LivestockController.GetById), createdResult.ActionName);
            Assert.Equal(createdDto.Id, createdResult.RouteValues?["id"]);
            Assert.Equal(createdDto, createdResult.Value);
        }

        [Fact]
        public async Task Update_ValidRequest_ReturnsOk()
        {
            // Arrange
            var id = Guid.NewGuid();
            var request = new UpdateLivestockRequest { TagNumber = "TAG-NEW", Name = "New Name" };
            var updatedDto = new LivestockDto { Id = id, TagNumber = "TAG-NEW", Name = "New Name" };
            
            _mockService.Setup(s => s.UpdateAsync(id, request)).ReturnsAsync(updatedDto);

            // Act
            var result = await _controller.Update(id, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(updatedDto, okResult.Value);
        }

        [Fact]
        public async Task Delete_ExistingId_ReturnsNoContent()
        {
            // Arrange
            var id = Guid.NewGuid();
            _mockService.Setup(s => s.DeleteAsync(id)).ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var id = Guid.NewGuid();
            _mockService.Setup(s => s.DeleteAsync(id)).ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(id);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
