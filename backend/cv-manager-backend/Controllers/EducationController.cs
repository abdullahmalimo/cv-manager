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

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EducationController : ControllerBase
    {
        private readonly CVDbContext _context;

        public EducationController(CVDbContext context)
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

        // Entity -> Response DTO
        private static EducationResponseDTO ToResponse(Education e)
        {
            return new EducationResponseDTO
            {
                Id = e.Id,
                Institution = e.Institution,
                Degree = e.Degree,
                StudyField = e.StudyField,
                StartDate = e.StartDate,
                EndDate = e.EndDate
            };
        }

        // GET: api/Education
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EducationResponseDTO>>> GetEducations()
        {
            int userId = GetCurrentUserId();

            var educations = await _context.Educations
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            return Ok(educations.Select(ToResponse));
        }

        // GET: api/Education/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EducationResponseDTO>> GetEducation(int id)
        {
            int userId = GetCurrentUserId();

            var education = await _context.Educations
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (education == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(education));
        }

        // POST: api/Education
        [HttpPost]
        public async Task<ActionResult<EducationResponseDTO>> CreateEducation(
            EducationRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var education = new Education
            {
                UserId = userId,
                Institution = request.Institution,
                Degree = request.Degree,
                StudyField = request.StudyField,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.Educations.Add(education);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEducation),
                new { id = education.Id },
                ToResponse(education));
        }

        // PUT: api/Education/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEducation(
            int id,
            EducationRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var education = await _context.Educations
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (education == null)
            {
                return NotFound();
            }

            education.Institution = request.Institution;
            education.Degree = request.Degree;
            education.StudyField = request.StudyField;
            education.StartDate = request.StartDate;
            education.EndDate = request.EndDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Education/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEducation(int id)
        {
            int userId = GetCurrentUserId();

            var education = await _context.Educations
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (education == null)
            {
                return NotFound();
            }

            _context.Educations.Remove(education);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}