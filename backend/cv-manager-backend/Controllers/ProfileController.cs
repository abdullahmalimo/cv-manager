using backend.Data;
using backend.Models.DTOs;
using backend.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly CVDbContext _context;

        public ProfileController(CVDbContext context)
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
        private static ProfileResponseDTO ToResponse(Profile p)
        {
            return new ProfileResponseDTO
            {
                Id = p.Id,
                FullName = p.FullName,
                ContactEmail = p.ContactEmail,
                MobileNumber = p.MobileNumber,
                CityName = p.CityName,
                Summary = p.Summary
            };
        }

        // GET: api/Profile
        [HttpGet]
        public async Task<ActionResult<ProfileResponseDTO>> GetProfile()
        {
            int userId = GetCurrentUserId();

            var profile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(profile));
        }

        // POST: api/Profile
        [HttpPost]
        public async Task<ActionResult<ProfileResponseDTO>> CreateProfile(
            ProfileRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var existingProfile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (existingProfile != null)
            {
                return Conflict("A profile already exists for this user.");
            }

            var profile = new Profile
            {
                UserId = userId,
                FullName = request.FullName,
                ContactEmail = request.ContactEmail,
                MobileNumber = request.MobileNumber,
                CityName = request.CityName,
                Summary = request.Summary
            };

            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProfile),
                null,
                ToResponse(profile));
        }

        // PUT: api/Profile
        [HttpPut]
        public async Task<IActionResult> UpdateProfile(
            ProfileRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var profile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound();
            }

            profile.FullName = request.FullName;
            profile.ContactEmail = request.ContactEmail;
            profile.MobileNumber = request.MobileNumber;
            profile.CityName = request.CityName;
            profile.Summary = request.Summary;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Profile
        [HttpDelete]
        public async Task<IActionResult> DeleteProfile()
        {
            int userId = GetCurrentUserId();

            var profile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound();
            }

            _context.Profiles.Remove(profile);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}