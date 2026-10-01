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
    public class CertificateController : ControllerBase
    {
        private readonly CVDbContext _context;

        public CertificateController(CVDbContext context)
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
        private static CertificateResponseDTO ToResponse(Certificate e)
        {
            return new CertificateResponseDTO
            {
                Id = e.Id,
                Name = e.Name,
                Issuer = e.Issuer,
                Description = e.Description,
                Url = e.Url,
                IssueDate = e.IssueDate
            };
        }

        // GET: api/Certificate
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CertificateResponseDTO>>> GetCertificates()
        {
            int userId = GetCurrentUserId();

            var certificates = await _context.Certificates
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.IssueDate)
                .ToListAsync();

            return Ok(certificates.Select(ToResponse));
        }

        // GET: api/Certificate/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CertificateResponseDTO>> GetCertificate(int id)
        {
            int userId = GetCurrentUserId();

            var certificate = await _context.Certificates
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (certificate == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(certificate));
        }

        // POST: api/Certificate
        [HttpPost]
        public async Task<ActionResult<CertificateResponseDTO>> CreateCertificate(
            CertificateRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var certificate = new Certificate
            {
                UserId = userId,
                Name = request.Name,
                Issuer = request.Issuer,
                Description = request.Description,
                Url = request.Url,
                IssueDate = request.IssueDate
            };

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCertificate),
                new { id = certificate.Id },
                ToResponse(certificate));
        }

        // PUT: api/Certificate/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCertificate(
            int id,
            CertificateRequestDTO request)
        {
            int userId = GetCurrentUserId();

            var certificate = await _context.Certificates
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (certificate == null)
            {
                return NotFound();
            }

            certificate.Name = request.Name;
            certificate.Issuer = request.Issuer;
            certificate.Description = request.Description;
            certificate.Url = request.Url;
            certificate.IssueDate = request.IssueDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Certificate/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCertificate(int id)
        {
            int userId = GetCurrentUserId();

            var certificate = await _context.Certificates
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (certificate == null)
            {
                return NotFound();
            }

            _context.Certificates.Remove(certificate);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}