using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _context;
    public CoursesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
    {
        var courses = await _context.Courses
            .Include(c => c.Faculty)
            .Select(c => new CourseDto
            {
                Id = c.Id,
                CourseNumber = c.CourseNumber,
                FacultyId = c.FacultyId,
                FacultyName = c.Faculty != null ? c.Faculty.Name : string.Empty
            }).ToListAsync();

        return Ok(courses);
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto dto)
    {
        var faculty = await _context.Faculties.FindAsync(dto.FacultyId);
        if (faculty == null)
            return NotFound("Gorkezilen fakultet tapylmady.");
        
        var course = new Course
        {
            CourseNumber = dto.CourseNumber,
            FacultyId = dto.FacultyId
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return Ok(new CourseDto
        {
           Id = course.Id,
           CourseNumber = course.CourseNumber,
           FacultyId = course.FacultyId,
           FacultyName = faculty.Name 
        });
    }
}