using backend.Controllers;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class CVController : ControllerBase
    {
        private readonly CVDbContext _context;
        public CVController(CVDbContext context)
        {
            _context = context;
        }
       [HttpGet]
       public async Task<IActionResult> GetCVs()
        {
            var cvs = await _context.CVs
            .Include(c => c.PersonalInformation)
            .Include(c => c.ExperienceInformation)
            .ToListAsync();
            return Ok(cvs);
        }
        [HttpGet("{id}")]

        public async Task<IActionResult> GetCV([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cv = await _context.CVs
                .Include(c => c.PersonalInformation)
                .Include(c => c.ExperienceInformation)
                .SingleOrDefaultAsync(m => m.Id == id);

            if (cv == null)
            {
                return NotFound();
            }

            return Ok(cv);
        }
    
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCV([FromRoute] int id, [FromBody] CV cv)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cv.Id)
            {
                return BadRequest();
            }

             var originalcv = await _context.CVs
            .Include(c => c.PersonalInformation)
            .Include(c => c.ExperienceInformation)
            .SingleOrDefaultAsync(c => c.Id == id);
            
            if(originalcv == null)
            {
                return NotFound();
            }

            
            if (cv.PersonalInformation == null || cv.ExperienceInformation == null)
                return BadRequest("PersonalInformation and ExperienceInformation are required.");

            originalcv.Name = cv.Name;

            originalcv.PersonalInformation.FullName = cv.PersonalInformation.FullName;
            originalcv.PersonalInformation.CityName = cv.PersonalInformation.CityName;
            originalcv.PersonalInformation.Email = cv.PersonalInformation.Email;
            originalcv.PersonalInformation.MobileNumber = cv.PersonalInformation.MobileNumber;
            

            
            originalcv.ExperienceInformation.CompanyName = cv.ExperienceInformation.CompanyName;
            originalcv.ExperienceInformation.City = cv.ExperienceInformation.City;
            originalcv.ExperienceInformation.CompanyField = cv.ExperienceInformation.CompanyField;
            

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CVExists(id))
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

     
        [HttpPost]
        public async Task<IActionResult> PostCV([FromBody] CV cv)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.CVs.Add(cv);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCV", new { id = cv.Id }, cv);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCV([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cv = await _context.CVs.SingleOrDefaultAsync(m => m.Id == id);
            if (cv == null)
            {
                return NotFound();
            }

            _context.CVs.Remove(cv);
            await _context.SaveChangesAsync();

            return Ok(cv);
        }

        private bool CVExists(int id)
        {
            return _context.CVs.Any(e => e.Id == id);
        }
    }

}
