using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CatalogApi.Controllers;
using CatalogApi.DTOs;
using CatalogApi.Services;
using FarmManagement.SharedKernel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CatalogApi.Tests.Controllers
{
    public class HealthRecordControllerTests
    {
        private readonly Mock<IHealthRecordService> _mockService;
        private readonly Mock<ILogger<HealthRecordController>> _mockLogger;
        private readonly HealthRecordController _controller;

        public HealthRecordControllerTests()
        {
            _mockService = new Mock<IHealthRecordService>();
            _mockLogger = new Mock<ILogger<HealthRecordController>>();
            _controller = new HealthRecordController(_mockService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var dtos = new List<HealthRecordDto> { new HealthRecordDto { Id = Guid.NewGuid() } };
            var paged = PagedResponse<HealthRecordDto>.Create(dtos, 1, 1, 20);
            
            _mockService.Setup(s => s.GetAllAsync(1, 20)).ReturnsAsync(paged);

            var result = await _controller.GetAll();

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(paged, ok.Value);
        }

        [Fact]
        public async Task GetById_ReturnsOk()
        {
            var id = Guid.NewGuid();
            var dto = new HealthRecordDto { Id = id };
            _mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(dto);

            var result = await _controller.GetById(id);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(dto, ok.Value);
        }

        [Fact]
        public async Task GetById_NotFound_ReturnsNotFound()
        {
            _mockService.Setup(s => s.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((HealthRecordDto?)null);

            var result = await _controller.GetById(Guid.NewGuid());

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
