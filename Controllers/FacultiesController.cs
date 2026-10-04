using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;

[ApiController]
[Route("api/[controller]")]
public class FacultiesController : ControllerBase
{
    private readonly AppDbContext _context;
    public FacultiesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FacultyDto>>> GetFaculties()
    {
        var faculties = await _context.Faculties
            .Select(f => new FacultyDto
            {
                Id = f.Id,
                Name = f.Name    
            }).ToListAsync();
        
        return Ok(faculties);
    }

    [HttpPost]
    [Authorize(Roles = "1")]
    public async Task<ActionResult<FacultyDto>> CreateFaculty(CreateFacultyDto dto)
    {
        var faculty = new Faculty
        {
            Name = dto.Name
        };

        _context.Faculties.Add(faculty);
        await _context.SaveChangesAsync();

        return Ok(new FacultyDto
        {
            Id = faculty.Id,
            Name = faculty.Name
        });
    }
}