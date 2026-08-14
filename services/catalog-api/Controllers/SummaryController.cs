using CatalogApi.DTOs;
using CatalogApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers;

[ApiController]
[Route("api/catalog/summary")]
[Authorize]
public class SummaryController : ControllerBase
{
    private readonly ILivestockService _livestockService;

    public SummaryController(ILivestockService livestockService)
    {
        _livestockService = livestockService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _livestockService.GetSummaryAsync();
        return Ok(summary);
    }
}
