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
    public class DairyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DairyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Dairy
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dairy>>> GetDairies()
        {
            return await _context.Dairies.ToListAsync();
        }

        // GET: api/Dairy/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Dairy>> GetDairy(Guid id)
        {
            var dairy = await _context.Dairies.FindAsync(id);

            if (dairy == null)
            {
                return NotFound();
            }

            return dairy;
        }

        // POST: api/Dairy
        [HttpPost]
        public async Task<ActionResult<Dairy>> PostDairy(Dairy dairy)
        {
            _context.Dairies.Add(dairy);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDairy", new { id = dairy.Id }, dairy);
        }

        // PUT: api/Dairy/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDairy(Guid id, Dairy dairy)
        {
            if (id != dairy.Id)
            {
                return BadRequest();
            }

            _context.Entry(dairy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DairyExists(id))
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

        // DELETE: api/Dairy/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDairy(Guid id)
        {
            var dairy = await _context.Dairies.FindAsync(id);
            if (dairy == null)
            {
                return NotFound();
            }

            _context.Dairies.Remove(dairy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DairyExists(Guid id)
        {
            return _context.Dairies.Any(e => e.Id == id);
        }
    }
}
