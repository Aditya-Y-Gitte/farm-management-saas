using FinanceApi.DTOs;
using FinanceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers;

[ApiController]
[Route("api/finance/summary")]
[Authorize]
public class SummaryController : ControllerBase
{
    private readonly IFinanceService _financeService;

    public SummaryController(IFinanceService financeService)
    {
        _financeService = financeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _financeService.GetSummaryAsync();
        return Ok(summary);
    }
}
