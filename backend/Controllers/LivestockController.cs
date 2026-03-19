using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LivestockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LivestockController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Livestock
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Livestock>>> GetLivestocks()
        {
            return await _context.Livestocks.ToListAsync();
        }

        // GET: api/Livestock/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Livestock>> GetLivestock(Guid id)
        {
            var livestock = await _context.Livestocks.FindAsync(id);

            if (livestock == null)
            {
                return NotFound();
            }

            return livestock;
        }

        // POST: api/Livestock
        [HttpPost]
        public async Task<ActionResult<Livestock>> PostLivestock(Livestock livestock)
        {
            _context.Livestocks.Add(livestock);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLivestock", new { id = livestock.Id }, livestock);
        }

        // PUT: api/Livestock/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLivestock(Guid id, Livestock livestock)
        {
            if (id != livestock.Id)
            {
                return BadRequest();
            }

            _context.Entry(livestock).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LivestockExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Livestock/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLivestock(Guid id)
        {
            var livestock = await _context.Livestocks.FindAsync(id);
            if (livestock == null)
            {
                return NotFound();
            }

            _context.Livestocks.Remove(livestock);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LivestockExists(Guid id)
        {
            return _context.Livestocks.Any(e => e.Id == id);
        }
    }
}
