using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using backend.Resources;

namespace backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class LivestockController : ControllerBase
    {
        private readonly ILivestockService _livestockService;
        private readonly IStringLocalizer<SharedResource> _localizer;

        public LivestockController(ILivestockService livestockService, IStringLocalizer<SharedResource> localizer)
        {
            _livestockService = livestockService;
            _localizer = localizer;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var records = await _livestockService.GetAllAsync();
            return Ok(records);
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
            var createdRecord = await _livestockService.CreateAsync(livestock);
            return CreatedAtAction(nameof(GetById), new { id = createdRecord.Id }, createdRecord);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Livestock livestock)
        {
            if (id != livestock.Id) return BadRequest(new { message = _localizer["ID mismatch"] });
            
            var updatedRecord = await _livestockService.UpdateAsync(livestock);
            return Ok(updatedRecord);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _livestockService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}