using FinanceApi.DTOs;
using FinanceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmManagement.SharedKernel.Exceptions;

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
    public async Task<IActionResult> GetIncomes([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        if (startDate.HasValue && endDate.HasValue && startDate > endDate)
        {
            return BadRequest(new { message = "startDate cannot be after endDate" });
        }

        var result = await _financeService.GetIncomesAsync(page, pageSize, startDate, endDate);
        return Ok(new { items = result.Items, totalCount = result.TotalCount, page, pageSize, totalPages = result.TotalPages });
    }

    [HttpGet("income/{id:guid}")]
    public async Task<IActionResult> GetIncomeById(Guid id)
    {
        var result = await _financeService.GetIncomeByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("income")]
    public async Task<IActionResult> CreateIncome([FromBody] CreateIncomeRequest request)
    {
        var result = await _financeService.CreateIncomeAsync(request);
        return CreatedAtAction(nameof(GetIncomeById), new { id = result.Id }, result);
    }

    [HttpPut("income/{id:guid}")]
    public async Task<IActionResult> UpdateIncome(Guid id, [FromBody] UpdateIncomeRequest request)
    {
        var result = await _financeService.UpdateIncomeAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("income/{id:guid}")]
    public async Task<IActionResult> DeleteIncome(Guid id)
    {
        var deleted = await _financeService.DeleteIncomeAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpGet("expense")]
    public async Task<IActionResult> GetExpenses([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        if (startDate.HasValue && endDate.HasValue && startDate > endDate)
        {
            return BadRequest(new { message = "startDate cannot be after endDate" });
        }

        var result = await _financeService.GetExpensesAsync(page, pageSize, startDate, endDate);
        return Ok(new { items = result.Items, totalCount = result.TotalCount, page, pageSize, totalPages = result.TotalPages });
    }

    [HttpGet("expense/{id:guid}")]
    public async Task<IActionResult> GetExpenseById(Guid id)
    {
        var result = await _financeService.GetExpenseByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("expense")]
    public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseRequest request)
    {
        var result = await _financeService.CreateExpenseAsync(request);
        return CreatedAtAction(nameof(GetExpenseById), new { id = result.Id }, result);
    }

    [HttpPut("expense/{id:guid}")]
    public async Task<IActionResult> UpdateExpense(Guid id, [FromBody] UpdateExpenseRequest request)
    {
        var result = await _financeService.UpdateExpenseAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("expense/{id:guid}")]
    public async Task<IActionResult> DeleteExpense(Guid id)
    {
        var deleted = await _financeService.DeleteExpenseAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
