using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;

namespace Oguz_Nyzam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentByGroup(int groupId)
    {
        var students = await _context.Students
            .Include(s => s.Group)
            .Where(s => s.GroupId == groupId)
            .Select(s => new StudentDto
            {
                Id = s.Id,
                FullName = s.FullName,
                StudentCardNumber = s.StudentCardNumber,
                GroupId = s.GroupId,
            }).ToListAsync();
        
        return Ok(students);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent(CreateStudentDto dto)
    {
        var group = await _context.Groups.FindAsync(dto.GroupId);
        if (group == null) 
            return NotFound("Gorkezilen topar bazada yok.");
        
        var student = new Student
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            StudentCardNumber = dto.StudentCardNumber,
            GroupId = dto.GroupId
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return Ok(new StudentDto
        {
            Id = student.Id,
            FullName = student.FullName,
            StudentCardNumber = student.StudentCardNumber,
            GroupId = student.GroupId,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(Guid id, UpdateStudentDto dto)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound("Talyp tapylmady.");
        
        var group = await _context.Groups.FindAsync(dto.GroupId);
        if (group == null)
            return NotFound("Gorkezen toparnyz tapylmady.");

        student.FullName = dto.FullName;
        student.StudentCardNumber = dto.StudentCardNumber;
        student.GroupId = dto.GroupId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(Guid id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
            return NotFound("Talyp tapylmady.");
        
        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}