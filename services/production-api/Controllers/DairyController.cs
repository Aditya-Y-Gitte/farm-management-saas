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
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var result = await _dairyService.GetAllAsync(page, pageSize);
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
    /// Returns a dairy record for a specific livestock on a specific date.
    /// </summary>
    [HttpGet("livestock/{livestockId:guid}/date")]
    public async Task<IActionResult> GetByLivestockIdAndDate(Guid livestockId, [FromQuery] DateTime date)
    {
        var record = await _dairyService.GetByLivestockIdAndDateAsync(livestockId, date);
        if (record is null) return NotFound();
        return Ok(record);
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
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _dairyService.GetSummaryAsync();
        return Ok(summary);
    }
}
