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
    public class SkillController : ControllerBase
    {
        private readonly CVDbContext _context;

        public SkillController(CVDbContext context)
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
        private static SkillResponseDTO ToResponse(Skill e)
        {
            return new SkillResponseDTO
            {
                Id = e.Id,
                Name = e.Name,
                Level = e.Level
            };
        }

        // GET: api/Skill
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillResponseDTO>>> GetSkills()
        {
            int userId = GetCurrentUserId();

            var skills = await _context.Skills
                .Where(e => e.UserId == userId)
                .OrderBy(e => e.Name)
                .ToListAsync();

            return Ok(skills.Select(ToResponse));
        }

        // GET: api/Skill/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SkillResponseDTO>> GetSkill(int id)
        {
            int userId = GetCurrentUserId();

            var skill = await _context.Skills
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (skill == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(skill));
        }

        // POST: api/Skill
        [HttpPost]
        public async Task<ActionResult<SkillResponseDTO>> CreateSkill(
            SkillRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var skill = new Skill
            {
                UserId = userId,
                Name = request.Name,
                Level = request.Level
            };

            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSkill),
                new { id = skill.Id },
                ToResponse(skill));
        }

        // PUT: api/Skill/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkill(
            int id,
            SkillRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var skill = await _context.Skills
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (skill == null)
            {
                return NotFound();
            }

            skill.Name = request.Name;
            skill.Level = request.Level;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Skill/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            int userId = GetCurrentUserId();

            var skill = await _context.Skills
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (skill == null)
            {
                return NotFound();
            }

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}