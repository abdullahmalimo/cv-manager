using backend.Data;
using backend.Models.DTOs;
using backend.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CVManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CVController : ControllerBase
    {
        private readonly CVDbContext _context;

        public CVController(CVDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException();
            }

            return int.Parse(userIdClaim);
        }

        // Entity -> Full Response DTO
        private static CVResponseDTO ToResponse(CV cv)
        {
            return new CVResponseDTO
            {
                Id = cv.Id,
                Title = cv.Title,
                Description = cv.Description,
                TemplateName = cv.TemplateName,
                Content = cv.Content,
                CreatedAt = cv.CreatedAt,
                UpdatedAt = cv.UpdatedAt
            };
        }

        // GET: api/CV
        // Returns CVs without their Content
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CVSummaryResponseDTO>>> GetCVs()
        {
            int userId = GetCurrentUserId();

            var cvs = await _context.CVs
                .Where(cv => cv.UserId == userId)
                .Select(cv => new CVSummaryResponseDTO
                {
                    Id = cv.Id,
                    Title = cv.Title,
                    Description = cv.Description,
                    TemplateName = cv.TemplateName,
                    CreatedAt = cv.CreatedAt,
                    UpdatedAt = cv.UpdatedAt
                })
                .ToListAsync();

            return Ok(cvs);
        }

        // GET: api/CV/5
        // Returns the complete CV, including Content
        [HttpGet("{id}")]
        public async Task<ActionResult<CVResponseDTO>> GetCV(int id)
        {
            int userId = GetCurrentUserId();

            var cv = await _context.CVs
                .FirstOrDefaultAsync(cv =>
                    cv.Id == id &&
                    cv.UserId == userId);

            if (cv == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(cv));
        }

        // POST: api/CV
        [HttpPost]
        public async Task<ActionResult<CVResponseDTO>> CreateCV(
            CVRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var cv = new CV
            {
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                TemplateName = request.TemplateName,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CVs.Add(cv);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCV),
                new { id = cv.Id },
                ToResponse(cv));
        }

        // PUT: api/CV/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCV(
            int id,
            CVRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var cv = await _context.CVs
                .FirstOrDefaultAsync(cv =>
                    cv.Id == id &&
                    cv.UserId == userId);

            if (cv == null)
            {
                return NotFound();
            }

            cv.Title = request.Title;
            cv.Description = request.Description;
            cv.TemplateName = request.TemplateName;
            cv.Content = request.Content;

            // CreatedAt should never change
            cv.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/CV/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCV(int id)
        {
            int userId = GetCurrentUserId();

            var cv = await _context.CVs
                .FirstOrDefaultAsync(cv =>
                    cv.Id == id &&
                    cv.UserId == userId);

            if (cv == null)
            {
                return NotFound();
            }

            _context.CVs.Remove(cv);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}