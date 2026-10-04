using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;
using Oguz_Nyzam.API.Resources;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "1,2,3")]
public class GroupsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStringLocalizer<SharedResource> _localizer;
    public GroupsController(AppDbContext context, IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _localizer = localizer;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroups()
    {
        var query = _context.Groups.AsQueryable();
        if (!User.IsInRole("1"))
        {
            var facultyClaim = User.FindFirst("FacultyId")?.Value;
            if (!int.TryParse(facultyClaim, out var facultyId))
                return Forbid();

            query = query.Where(group => group.Course.FacultyId == facultyId);
        }

        var groups = await query
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
    [Authorize(Roles = "1")]
    public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto dto)
    {
        if (dto.GroupNumber <= 0 || dto.CourseId <= 0)
            return BadRequest(_localizer["InvalidGroupDetails"]);

        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null)
            return NotFound(_localizer["CourseNotFound"]);

        var duplicateGroup = await _context.Groups.AnyAsync(group =>
            group.CourseId == dto.CourseId && group.GroupNumber == dto.GroupNumber);
        if (duplicateGroup)
            return Conflict(_localizer["GroupAlreadyExists"]);
        
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