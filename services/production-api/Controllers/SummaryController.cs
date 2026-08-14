using ProductionApi.DTOs;
using ProductionApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProductionApi.Controllers;

[ApiController]
[Route("api/production/summary")]
[Authorize]
public class SummaryController : ControllerBase
{
    private readonly IDairyService _dairyService;
    // Add feed service here in the future if needed

    public SummaryController(IDairyService dairyService)
    {
        _dairyService = dairyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _dairyService.GetSummaryAsync();
        return Ok(summary);
    }
}
