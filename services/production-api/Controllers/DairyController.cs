using ProductionApi.Models;
using ProductionApi.Services;
using ProductionApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProductionApi.Controllers;

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

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var (items, totalCount) = await _dairyService.GetAllAsync(page, pageSize);

        return Ok(new
        {
            items,
            totalCount,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var record = await _dairyService.GetByIdAsync(id);
        if (record == null) return NotFound();
        return Ok(record);
    }

    [HttpGet("livestock/{livestockId:guid}/date")]
    public async Task<IActionResult> GetByLivestockIdAndDate(Guid livestockId, [FromQuery] DateTime date)
    {
        var record = await _dairyService.GetByLivestockIdAndDateAsync(livestockId, date);
        if (record == null) return NotFound();
        return Ok(record);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Dairy dairy)
    {
        var created = await _dairyService.CreateAsync(dairy);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Dairy dairy)
    {
        if (id != dairy.Id)
            return BadRequest(new { message = "ID in URL does not match ID in body." });

        var updated = await _dairyService.UpdateAsync(dairy);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _dairyService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Summary endpoint for the API Gateway metrics aggregation.
    /// </summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _dairyService.GetSummaryAsync();
        return Ok(summary);
    }
}
