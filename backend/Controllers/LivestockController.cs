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
    public class LivestockController : ControllerBase
    {
        private readonly ILivestockService _livestockService;

        public LivestockController(ILivestockService livestockService)
        {
            _livestockService = livestockService;
        }

        // GET: api/Livestock
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Livestock>>> GetLivestocks()
        {
            return Ok(await _livestockService.GetAllAsync());
        }

        // GET: api/Livestock/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Livestock>> GetLivestock(Guid id)
        {
            var livestock = await _livestockService.GetByIdAsync(id);

            if (livestock == null)
            {
                return NotFound();
            }

            return Ok(livestock);
        }

        // POST: api/Livestock
        [HttpPost]
        public async Task<ActionResult<Livestock>> PostLivestock(Livestock livestock)
        {
            var createdLivestock = await _livestockService.CreateAsync(livestock);
            return CreatedAtAction("GetLivestock", new { id = createdLivestock.Id }, createdLivestock);
        }

        // PUT: api/Livestock/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLivestock(Guid id, Livestock livestock)
        {
            if (id != livestock.Id)
            {
                return BadRequest();
            }

            var updatedLivestock = await _livestockService.UpdateAsync(livestock);
            if (updatedLivestock == null)
            {
                return NotFound();
            }
            
            return NoContent();
        }

        // DELETE: api/Livestock/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLivestock(Guid id)
        {
            var deleted = await _livestockService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
