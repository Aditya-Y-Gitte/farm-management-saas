using System.Threading.Tasks;
using ProductionApi.Controllers;
using ProductionApi.DTOs;
using ProductionApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ProductionApi.Tests.Controllers;

public class SummaryControllerTests
{
    private readonly Mock<IDairyService> _mockService;
    private readonly SummaryController _controller;

    public SummaryControllerTests()
    {
        _mockService = new Mock<IDairyService>();
        _controller = new SummaryController(_mockService.Object);
    }

    [Fact]
    public async Task GetSummary_ReturnsOkWithData()
    {
        var mockData = new DairySummaryDto
        {
            TotalMilkToday = 150,
            TotalMilkThisWeek = 1000,
            TotalRecords = 10,
            AverageFatContent = 4.2m,
            AverageSnfContent = 3.5m
        };

        _mockService.Setup(s => s.GetSummaryAsync()).ReturnsAsync(mockData);

        var result = await _controller.GetSummary();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<DairySummaryDto>(okResult.Value);
        Assert.Equal(150, dto.TotalMilkToday);
    }
}
