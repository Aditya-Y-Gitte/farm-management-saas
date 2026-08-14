using System.Threading.Tasks;
using CatalogApi.Controllers;
using CatalogApi.DTOs;
using CatalogApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CatalogApi.Tests.Controllers;

public class SummaryControllerTests
{
    private readonly Mock<ILivestockService> _mockService;
    private readonly SummaryController _controller;

    public SummaryControllerTests()
    {
        _mockService = new Mock<ILivestockService>();
        _controller = new SummaryController(_mockService.Object);
    }

    [Fact]
    public async Task GetSummary_ReturnsOkWithData()
    {
        // Arrange
        var mockData = new CatalogSummaryDto { TotalLivestock = 42, AttentionCount = 5 };
        _mockService.Setup(s => s.GetSummaryAsync()).ReturnsAsync(mockData);

        // Act
        var result = await _controller.GetSummary();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<CatalogSummaryDto>(okResult.Value);
        Assert.Equal(42, dto.TotalLivestock);
        Assert.Equal(5, dto.AttentionCount);
    }
}
