using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using CatalogApi.Controllers;
using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Services;
using FarmManagement.SharedKernel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CatalogApi.Tests.Controllers
{
    public class BreedingCycleControllerTests
    {
        private readonly Mock<IBreedingCycleService> _mockService;
        private readonly Mock<ILogger<BreedingCycleController>> _mockLogger;
        private readonly BreedingCycleController _controller;

        public BreedingCycleControllerTests()
        {
            _mockService = new Mock<IBreedingCycleService>();
            _mockLogger = new Mock<ILogger<BreedingCycleController>>();
            _controller = new BreedingCycleController(_mockService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var dtos = new List<BreedingCycleDto> { new BreedingCycleDto { Id = Guid.NewGuid() } };
            var paged = PagedResponse<BreedingCycleDto>.Create(dtos, 1, 1, 20);
            
            _mockService.Setup(s => s.GetAllAsync(1, 20)).ReturnsAsync(paged);

            var result = await _controller.GetAll();

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(paged, ok.Value);
        }

        [Fact]
        public async Task GetById_ReturnsOk()
        {
            var id = Guid.NewGuid();
            var dto = new BreedingCycleDto { Id = id };
            _mockService.Setup(s => s.GetByIdAsync(id)).ReturnsAsync(dto);

            var result = await _controller.GetById(id);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(dto, ok.Value);
        }

        [Fact]
        public async Task GetById_NotFound_ReturnsNotFound()
        {
            _mockService.Setup(s => s.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((BreedingCycleDto?)null);

            var result = await _controller.GetById(Guid.NewGuid());

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void CreateRequest_InvalidStatus_FailsValidation()
        {
            var request = new CreateBreedingCycleRequest
            {
                LivestockId = Guid.NewGuid(),
                BreedingDate = DateTime.UtcNow,
                Method = BreedingMethod.ArtificialInsemination,
                Status = "InvalidStatus"
            };

            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("Status"));
        }

        [Fact]
        public void CreateRequest_InvalidDates_FailsValidation()
        {
            var request = new CreateBreedingCycleRequest
            {
                LivestockId = Guid.NewGuid(),
                BreedingDate = new DateTime(2026, 1, 2),
                Method = BreedingMethod.ArtificialInsemination,
                Status = BreedingStatus.Inseminated,
                ExpectedDeliveryDate = new DateTime(2026, 1, 1) // Before BreedingDate
            };

            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("ExpectedDeliveryDate"));
        }
    }
}
