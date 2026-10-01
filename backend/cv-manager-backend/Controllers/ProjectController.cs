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
    public class ProjectController : ControllerBase
    {
        private readonly CVDbContext _context;

        public ProjectController(CVDbContext context)
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
        private static ProjectResponseDTO ToResponse(Project e)
        {
            return new ProjectResponseDTO
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                Technologies = e.Technologies,
                Url = e.Url,
                StartDate = e.StartDate,
                EndDate = e.EndDate
            };
        }

        // GET: api/Project
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDTO>>> GetProjects()
        {
            int userId = GetCurrentUserId();

            var projects = await _context.Projects
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

            return Ok(projects.Select(ToResponse));
        }

        // GET: api/Project/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponseDTO>> GetProject(int id)
        {
            int userId = GetCurrentUserId();

            var project = await _context.Projects
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(project));
        }

        // POST: api/Project
        [HttpPost]
        public async Task<ActionResult<ProjectResponseDTO>> CreateProject(
            ProjectRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var project = new Project
            {
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                Technologies = request.Technologies,
                Url = request.Url,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProject),
                new { id = project.Id },
                ToResponse(project));
        }

        // PUT: api/Project/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(
            int id,
            ProjectRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var project = await _context.Projects
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            project.Name = request.Name;
            project.Description = request.Description;
            project.Technologies = request.Technologies;
            project.Url = request.Url;
            project.StartDate = request.StartDate;
            project.EndDate = request.EndDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Project/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            int userId = GetCurrentUserId();

            var project = await _context.Projects
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}