using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;

[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly AppDbContext _context;
    public GroupsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroups()
    {
        var groups = await _context.Groups
            .Include(g => g.Course)
            .Select(g => new GroupDto
            {
                Id = g.Id,
                GroupNumber = g.GroupNumber,
                CourseId = g.CourseId,
                CourseNumber = g.Course != null ? g.Course.CourseNumber : string.Empty
            }).ToListAsync();

        return Ok(groups);
    }

    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto dto)
    {
        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null)
            return NotFound("Gorkezilen kurs tapylmady.");
        
        var group = new Group
        {
            GroupNumber = dto.GroupNumber,
            CourseId = dto.CourseId
        };

        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        return Ok(new GroupDto
        {
           Id = group.Id,
           GroupNumber = group.GroupNumber,
           CourseId = group.CourseId,
           CourseNumber = course.CourseNumber 
        });
    }
}