using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public AttendanceController(AppDbContext context, IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _localizer = localizer;
    }

    [HttpPost]
    public async Task<ActionResult<AttendanceRecordDto>> CreateAttendanceRecord(CreateAttendanceRecordDto dto)
    {
        var group = await _context.Groups
            .Include(group => group.Course)
            .FirstOrDefaultAsync(group => group.Id == dto.GroupId);
        if (group == null || !HasAccessToGroup(group.Course.FacultyId))
            return NotFound(_localizer["GroupNotFound"]);

        if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var teacherId))
            return Unauthorized(_localizer["InvalidCredentials"]);

        var teacherExists = await _context.Users.AnyAsync(user =>
            user.Id == teacherId && user.RoleId != null);
        if (!teacherExists)
            return Unauthorized(_localizer["InvalidCredentials"]);

        if (dto.Date == default)
            return BadRequest(_localizer["InvalidAttendanceDate"]);

        var rosterStudentIds = await _context.Students
            .Where(student => student.GroupId == group.Id)
            .Select(student => student.Id)
            .ToListAsync();
        if (rosterStudentIds.Count == 0)
            return BadRequest(_localizer["GroupHasNoStudents"]);

        var studentIds = dto.Details.Select(detail => detail.StudentId).ToList();
        if (studentIds.Count != studentIds.Distinct().Count())
            return BadRequest(_localizer["DuplicateAttendanceStudents"]);

        if (studentIds.Count != rosterStudentIds.Count || rosterStudentIds.Any(id => !studentIds.Contains(id)))
            return BadRequest(_localizer["AttendanceStudentGroupMismatch"]);

        var violationIds = dto.Details
            .Where(detail => detail.ViolationCategoryId.HasValue)
            .Select(detail => detail.ViolationCategoryId!.Value)
            .Distinct()
            .ToList();
        if (violationIds.Count > 0 &&
            await _context.ViolationCategories.CountAsync(category => violationIds.Contains(category.Id)) != violationIds.Count)
            return BadRequest(_localizer["ViolationCategoryNotFound"]);

        var record = new AttendanceRecord
        {
            Id = Guid.NewGuid(),
            Date = dto.Date,
            GroupId = dto.GroupId,
            TeacherId = teacherId,
            IsSubmitted = true,
            SubmittedAt = DateTime.UtcNow
        };

        foreach (var detailDto in dto.Details)
        {
            record.Details.Add(new AttendanceDetail
            {
                Id = Guid.NewGuid(),
                AttendanceRecordId = record.Id,
                StudentId = detailDto.StudentId,
                ViolationCategoryId = detailDto.ViolationCategoryId,
                Note = detailDto.Note
            });
        }

        _context.AttendanceRecords.Add(record);
        await _context.SaveChangesAsync();

        return Ok(new { Message = _localizer["AttendanceSaved"].Value, RecordId = record.Id });
    }

    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<AttendanceRecordDto>>> GetGroupAttendance(int groupId)
    {
        var group = await _context.Groups
            .Where(group => group.Id == groupId)
            .Select(group => new { group.Id, FacultyId = group.Course.FacultyId })
            .FirstOrDefaultAsync();
        if (group == null || !HasAccessToGroup(group.FacultyId))
            return NotFound(_localizer["GroupNotFound"]);

        var records = await _context.AttendanceRecords
            .Include(record => record.Group)
            .Include(record => record.Teacher)
            .Include(record => record.Details)
                .ThenInclude(detail => detail.Student)
            .Include(record => record.Details)
                .ThenInclude(detail => detail.ViolationCategory)
            .Where(record => record.GroupId == groupId)
            .OrderByDescending(record => record.Date)
            .ToListAsync();

        var localizedRecords = records.Select(record => new AttendanceRecordDto
        {
            Id = record.Id,
            Date = record.Date,
            GroupId = record.GroupId,
            GroupNumber = record.Group.GroupNumber,
            TeacherName = record.Teacher.FullName,
            IsSubmitted = record.IsSubmitted,
            SubmittedAt = record.SubmittedAt,
            Details = record.Details.Select(detail => new AttendanceDetailDto
            {
                Id = detail.Id,
                StudentId = detail.StudentId,
                StudentName = detail.Student.FullName,
                ViolationCategoryId = detail.ViolationCategoryId,
                ViolationCategoryName = detail.ViolationCategoryId switch
                {
                    1 => _localizer["ViolationAbsent"].Value,
                    2 => _localizer["ViolationNoStudentCard"].Value,
                    3 => _localizer["ViolationUniform"].Value,
                    _ => _localizer["AttendancePresent"].Value
                },
                Note = detail.Note
            }).ToList()
        });

        return Ok(localizedRecords);
    }

    private bool HasAccessToGroup(int groupFacultyId)
    {
        if (User.IsInRole("1"))
            return true;

        var facultyClaim = User.FindFirst("FacultyId")?.Value;
        return int.TryParse(facultyClaim, out var facultyId) && facultyId == groupFacultyId;
    }
}
