using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DairyController : ControllerBase
    {
        private readonly IDairyService _dairyService;

        public DairyController(IDairyService dairyService)
        {
            _dairyService = dairyService;
        }

        // GET: api/Dairy
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dairy>>> GetDairies()
        {
            return Ok(await _dairyService.GetAllAsync());
        }

        // GET: api/Dairy/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Dairy>> GetDairy(Guid id)
        {
            var dairy = await _dairyService.GetByIdAsync(id);

            if (dairy == null)
            {
                return NotFound();
            }

            return Ok(dairy);
        }

        // POST: api/Dairy
        [HttpPost]
        public async Task<ActionResult<Dairy>> PostDairy(Dairy dairy)
        {
            var createdDairy = await _dairyService.CreateAsync(dairy);
            return CreatedAtAction("GetDairy", new { id = createdDairy.Id }, createdDairy);
        }

        // PUT: api/Dairy/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDairy(Guid id, Dairy dairy)
        {
            if (id != dairy.Id)
            {
                return BadRequest();
            }

            var updatedDairy = await _dairyService.UpdateAsync(dairy);
            if (updatedDairy == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Dairy/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDairy(Guid id)
        {
            var deleted = await _dairyService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
