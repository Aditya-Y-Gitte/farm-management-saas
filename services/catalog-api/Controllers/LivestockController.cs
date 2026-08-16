using CatalogApi.DTOs;
using CatalogApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers;

/// <summary>
/// Presentation layer for the Livestock domain.
/// Responsibilities: routing, HTTP status mapping, and delegating to ILivestockService.
/// Contains zero business logic and zero database access.
/// </summary>
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
    /// Returns a paginated list of livestock for the authenticated tenant.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var result = await _livestockService.GetAllAsync(page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Returns a single livestock record by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var record = await _livestockService.GetByIdAsync(id);
        if (record is null) return NotFound();
        return Ok(record);
    }

    /// <summary>
    /// Creates a new livestock record for the authenticated tenant.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLivestockRequest request)
    {
        var created = await _livestockService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Updates an existing livestock record. ID in URL must match body.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLivestockRequest request)
    {
        var updated = await _livestockService.UpdateAsync(id, request);
        return Ok(updated);
    }

    /// <summary>
    /// Deletes a livestock record by ID.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _livestockService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Returns livestock requiring attention.
    /// </summary>
    [HttpGet("attention")]
    public async Task<IActionResult> GetAttention([FromQuery] int limit = 5)
    {
        if (limit < 1 || limit > 50) limit = 5;
        var result = await _livestockService.GetAttentionAsync(limit);
        return Ok(result);
    }
}
