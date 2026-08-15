using ProductionApi.DTOs;
using ProductionApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProductionApi.Controllers;

/// <summary>
/// Presentation layer for the Dairy production domain.
/// Responsibilities: routing, HTTP status mapping, delegating to IDairyService.
/// Contains zero business logic and zero database access.
/// </summary>
[ApiController]
[Route("api/production/[controller]")]
[Authorize]
public class DairyController : ControllerBase
{
    private readonly IDairyService _dairyService;
    private readonly ILogger<DairyController> _logger;

    public DairyController(IDairyService dairyService, ILogger<DairyController> logger)
    {
        _dairyService = dairyService;
        _logger = logger;
    }

    /// <summary>
    /// Returns a paginated list of dairy records for the authenticated tenant.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] Guid? livestockId = null,
        [FromQuery] string? session = null)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var result = await _dairyService.GetAllAsync(page, pageSize, startDate, endDate, livestockId, session);
        return Ok(result);
    }

    /// <summary>
    /// Returns a single dairy record by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var record = await _dairyService.GetByIdAsync(id);
        if (record is null) return NotFound();
        return Ok(record);
    }

    /// <summary>
    /// Returns a dairy record for a specific livestock on a specific date and session.
    /// </summary>
    [HttpGet("livestock/{livestockId:guid}/date")]
    public async Task<IActionResult> GetByLivestockDateAndSession(Guid livestockId, [FromQuery] DateTime date, [FromQuery] string session)
    {
        var record = await _dairyService.GetByLivestockDateAndSessionAsync(livestockId, date, session);
        if (record is null) return NotFound();
        return Ok(record);
    }

    /// <summary>
    /// Returns a paginated list of dairy records for a specific livestock.
    /// </summary>
    [HttpGet("livestock/{livestockId:guid}")]
    public async Task<IActionResult> GetByLivestockId(Guid livestockId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var result = await _dairyService.GetByLivestockIdAsync(livestockId, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new dairy production record.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDairyRequest request)
    {
        var created = await _dairyService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Updates an existing dairy record.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDairyRequest request)
    {
        var updated = await _dairyService.UpdateAsync(id, request);
        return Ok(updated);
    }

    /// <summary>
    /// Deletes a dairy record by ID.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _dairyService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Returns aggregated production statistics.
    /// Consumed by the API Gateway metrics aggregation endpoint.
    /// </summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] Guid? livestockId = null)
    {
        var summary = await _dairyService.GetSummaryAsync(livestockId);
        return Ok(summary);
    }

    /// <summary>
    /// Returns aggregated dairy production points for a specified date range.
    /// Useful for chart trends.
    /// </summary>
    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        [FromQuery] Guid? livestockId = null,
        [FromQuery] string? session = null)
    {
        if (startDate >= endDate)
        {
            return BadRequest(new { message = "startDate must be before endDate" });
        }
        var trends = await _dairyService.GetTrendsAsync(startDate, endDate, livestockId, session);
        return Ok(trends);
    }
}
