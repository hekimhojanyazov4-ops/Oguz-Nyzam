using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;
using Oguz_Nyzam.API.Resources;

namespace Oguz_Nyzam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "1,2,3")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public StudentsController(AppDbContext context, IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _localizer = localizer;
    }

    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentByGroup(int groupId)
    {
        if (!await HasAccessToGroup(groupId))
            return NotFound(_localizer["GroupNotFound"]);

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
            return NotFound(_localizer["GroupNotFound"]);
        if (!await HasAccessToGroup(dto.GroupId))
            return NotFound(_localizer["GroupNotFound"]);
        
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
            return NotFound(_localizer["StudentNotFound"]);
        
        var group = await _context.Groups.FindAsync(dto.GroupId);
        if (group == null)
            return NotFound(_localizer["GroupNotFound"]);
        if (!await HasAccessToGroup(dto.GroupId))
            return NotFound(_localizer["GroupNotFound"]);
        if (!await HasAccessToGroup(student.GroupId))
            return NotFound(_localizer["StudentNotFound"]);

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
            return NotFound(_localizer["StudentNotFound"]);
        if (!await HasAccessToGroup(student.GroupId))
            return NotFound(_localizer["StudentNotFound"]);
        
        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Task<bool> HasAccessToGroup(int groupId)
    {
        if (User.IsInRole("1"))
            return _context.Groups.AnyAsync(group => group.Id == groupId);

        var facultyClaim = User.FindFirst("FacultyId")?.Value;
        if (!int.TryParse(facultyClaim, out var facultyId))
            return Task.FromResult(false);

        return _context.Groups.AnyAsync(group =>
            group.Id == groupId && group.Course.FacultyId == facultyId);
    }
}