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

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExperienceController : ControllerBase
{
    private readonly CVDbContext _context;

    public ExperienceController(CVDbContext context)
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

    // Entity -> Response DTO.
    private static ExperienceResponseDTO ToResponse(Experience e)
    {
        return new ExperienceResponseDTO
        {
            Id = e.Id,
            CompanyName = e.CompanyName,
            JobTitle = e.JobTitle,
            Description = e.Description,
            City = e.City,
            StartDate = e.StartDate,
            EndDate = e.EndDate
        };
    }

    // GET: api/Experience
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExperienceResponseDTO>>> GetExperiences()
    {
        int userId = GetCurrentUserId();

        var experiences = await _context.Experiences
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();

        return Ok(experiences.Select(ToResponse));
    }

    // GET: api/Experience/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ExperienceResponseDTO>> GetExperience(int id)
    {
        int userId = GetCurrentUserId();

        var experience = await _context.Experiences
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (experience == null)
        {
            return NotFound();
        }

        return Ok(ToResponse(experience));
    }

    // POST: api/Experience
    [HttpPost]
    public async Task<ActionResult<ExperienceResponseDTO>> CreateExperience(
        ExperienceRequestDTO request)
    {
        int userId = GetCurrentUserId();

        var experience = new Experience
        {
            UserId = userId,
            CompanyName = request.CompanyName,
            JobTitle = request.JobTitle,
            Description = request.Description,
            City = request.City,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        _context.Experiences.Add(experience);
        await _context.SaveChangesAsync();   // EF adds experience.Id here

        return CreatedAtAction(
            nameof(GetExperience),
            new { id = experience.Id },
            ToResponse(experience));
    }

    // PUT: api/Experience/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExperience(
        int id,
        ExperienceRequestDTO request)
    {
        int userId = GetCurrentUserId();

        var experience = await _context.Experiences
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (experience == null)
        {
            return NotFound();
        }

        experience.CompanyName = request.CompanyName;
        experience.JobTitle = request.JobTitle;
        experience.Description = request.Description;
        experience.City = request.City;
        experience.StartDate = request.StartDate;
        experience.EndDate = request.EndDate;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/Experience/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExperience(int id)
    {
        int userId = GetCurrentUserId();

        var experience = await _context.Experiences
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (experience == null)
        {
            return NotFound();
        }

        _context.Experiences.Remove(experience);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}