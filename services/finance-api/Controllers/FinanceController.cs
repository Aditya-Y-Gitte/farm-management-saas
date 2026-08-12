using FinanceApi.DTOs;
using FinanceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers;

[ApiController]
[Route("api/finance")]
[Authorize]
public class FinanceController : ControllerBase
{
    private readonly IFinanceService _financeService;

    public FinanceController(IFinanceService financeService)
    {
        _financeService = financeService;
    }

    [HttpGet("income")]
    public async Task<IActionResult> GetIncomes([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _financeService.GetIncomesAsync(page, pageSize);
        return Ok(new { items = result.Items, totalCount = result.TotalCount, page, pageSize, totalPages = result.TotalPages });
    }

    [HttpPost("income")]
    public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeRequest request)
    {
        var result = await _financeService.CreateIncomeAsync(request);
        return Ok(result);
    }

    [HttpGet("expense")]
    public async Task<IActionResult> GetExpenses([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _financeService.GetExpensesAsync(page, pageSize);
        return Ok(new { items = result.Items, totalCount = result.TotalCount, page, pageSize, totalPages = result.TotalPages });
    }

    [HttpPost("expense")]
    public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseRequest request)
    {
        var result = await _financeService.CreateExpenseAsync(request);
        return Ok(result);
    }
}
