using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class DairyController : ControllerBase
    {
        private readonly IDairyService _dairyService;

        public DairyController(IDairyService dairyService)
        {
            _dairyService = dairyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var records = await _dairyService.GetAllAsync();
            return Ok(records);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var record = await _dairyService.GetByIdAsync(id);
            if (record == null) return NotFound();
            return Ok(record);
        }

        [HttpGet("livestock/{livestockId:guid}/date/{date:datetime}")]
        public async Task<IActionResult> GetByLivestockIdAndDate(Guid livestockId, DateTime date)
        {
            var record = await _dairyService.GetByLivestockIdAndDateAsync(livestockId, date);
            if (record == null) return NotFound();
            return Ok(record);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Dairy dairy)
        {
            try
            {
                var createdRecord = await _dairyService.CreateAsync(dairy);
                return CreatedAtAction(nameof(GetById), new { id = createdRecord.Id }, createdRecord);
            }
            catch (Exception ex)
            {
                // Catches the duplication logic exception implemented in DairyService
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Dairy dairy)
        {
            if (id != dairy.Id) return BadRequest(new { message = "ID mismatch" });
            
            var updatedRecord = await _dairyService.UpdateAsync(dairy);
            return Ok(updatedRecord);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _dairyService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}