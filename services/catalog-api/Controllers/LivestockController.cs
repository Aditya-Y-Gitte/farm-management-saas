using CatalogApi.Models;
using CatalogApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers;

[ApiController]
[Route("api/catalog/[controller]")]
[Authorize]
public class LivestockController : ControllerBase
{
    private readonly ILivestockService _livestockService;
    private readonly ILogger<LivestockController> _logger;

    public LivestockController(ILivestockService livestockService, ILogger<LivestockController> logger)
    {
        _livestockService = livestockService;
        _logger = logger;
    }

    /// <summary>
    /// Get all livestock with pagination. Automatically scoped by tenant.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var (items, totalCount) = await _livestockService.GetAllAsync(page, pageSize);

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
        var record = await _livestockService.GetByIdAsync(id);
        if (record == null) return NotFound();
        return Ok(record);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Livestock livestock)
    {
        var created = await _livestockService.CreateAsync(livestock);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Livestock livestock)
    {
        if (id != livestock.Id)
            return BadRequest(new { message = "ID in URL does not match ID in body." });

        var updated = await _livestockService.UpdateAsync(livestock);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _livestockService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Count endpoint for the API Gateway metrics aggregation.
    /// </summary>
    [HttpGet("count")]
    public async Task<IActionResult> GetCount()
    {
        var count = await _livestockService.GetCountAsync();
        return Ok(new { totalLivestock = count });
    }
}
