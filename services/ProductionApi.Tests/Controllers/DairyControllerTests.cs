using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FarmManagement.SharedKernel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using ProductionApi.Controllers;
using ProductionApi.DTOs;
using ProductionApi.Services;
using Xunit;

namespace ProductionApi.Tests.Controllers
{
    public class DairyControllerTests
    {
        private readonly Mock<IDairyService> _mockService;
        private readonly Mock<ILogger<DairyController>> _mockLogger;
        private readonly DairyController _controller;

        public DairyControllerTests()
        {
            _mockService = new Mock<IDairyService>();
            _mockLogger = new Mock<ILogger<DairyController>>();
            _controller = new DairyController(_mockService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkWithPagedResponse()
        {
            var dtos = new List<DairyDto> { new DairyDto { Id = Guid.NewGuid(), MilkYield = 10 } };
            var pagedResponse = PagedResponse<DairyDto>.Create(dtos, 1, 1, 20);
            
            _mockService.Setup(s => s.GetAllAsync(1, 20)).ReturnsAsync(pagedResponse);

            var result = await _controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(pagedResponse, okResult.Value);
        }

        [Fact]
        public async Task GetById_ExistingId_ReturnsOk()
        {
            var id = Guid.NewGuid();
            var dto = new DairyDto { Id = id, MilkYield = 15 };
            _mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(dto);

            var result = await _controller.GetById(id);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(dto, okResult.Value);
        }

        [Fact]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            var id = Guid.NewGuid();
            _mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync((DairyDto?)null);

            var result = await _controller.GetById(id);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ValidRequest_ReturnsCreatedAtAction()
        {
            var request = new CreateDairyRequest { LivestockId = Guid.NewGuid(), Date = DateTime.UtcNow, Session = "Morning", MilkYield = 12 };
            var createdDto = new DairyDto { Id = Guid.NewGuid(), LivestockId = request.LivestockId, MilkYield = 12 };
            
            _mockService.Setup(s => s.CreateAsync(request)).ReturnsAsync(createdDto);

            var result = await _controller.Create(request);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(DairyController.GetById), createdResult.ActionName);
            Assert.Equal(createdDto.Id, createdResult.RouteValues?["id"]);
            Assert.Equal(createdDto, createdResult.Value);
        }

        [Fact]
        public async Task Update_ValidRequest_ReturnsOk()
        {
            var id = Guid.NewGuid();
            var request = new UpdateDairyRequest { LivestockId = Guid.NewGuid(), Date = DateTime.UtcNow, Session = "Evening", MilkYield = 14 };
            var updatedDto = new DairyDto { Id = id, LivestockId = request.LivestockId, MilkYield = 14 };
            
            _mockService.Setup(s => s.UpdateAsync(id, request)).ReturnsAsync(updatedDto);

            var result = await _controller.Update(id, request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(updatedDto, okResult.Value);
        }

        [Fact]
        public async Task Delete_ExistingId_ReturnsNoContent()
        {
            var id = Guid.NewGuid();
            _mockService.Setup(s => s.DeleteAsync(id)).ReturnsAsync(true);

            var result = await _controller.Delete(id);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_NonExistingId_ReturnsNotFound()
        {
            var id = Guid.NewGuid();
            _mockService.Setup(s => s.DeleteAsync(id)).ReturnsAsync(false);

            var result = await _controller.Delete(id);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
