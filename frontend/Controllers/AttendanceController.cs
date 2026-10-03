using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;

namespace Oguz_Nyzam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _context;

    public AttendanceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<AttendanceRecordDto>> CreateAttendanceRecord(CreateAttendanceRecordDto dto)
    {
        var group = await _context.Groups.FindAsync(dto.GroupId);
        if (group == null)
            return NotFound("Topar tapylmady.");

        var teacher = await _context.Users.FindAsync(dto.TeacherId);
        if (teacher == null)
            return NotFound("Mugallym tapylmady.");

        var record = new AttendanceRecord
        {
            Id = Guid.NewGuid(),
            Date = dto.Date,
            GroupId = dto.GroupId,
            TeacherId = dto.TeacherId,
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

        return Ok(new { Message = "Nyzam barlagy üstünlikli saklandy!", RecordId = record.Id });
    }

    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<AttendanceRecordDto>>> GetGroupAttendance(int groupId)
    {
        var records = await _context.AttendanceRecords
            .Include(r => r.Group)
            .Include(r => r.Teacher)
            .Include(r => r.Details)
                .ThenInclude(d => d.Student)
            .Include(r => r.Details)
                .ThenInclude(d => d.ViolationCategory)
            .Where(r => r.GroupId == groupId)
            .OrderByDescending(r => r.Date)
            .Select(r => new AttendanceRecordDto
            {
                Id = r.Id,
                Date = r.Date,
                GroupId = r.GroupId,
                GroupNumber = r.Group.GroupNumber,
                TeacherName = r.Teacher.FullName,
                IsSubmitted = r.IsSubmitted,
                SubmittedAt = r.SubmittedAt,
                Details = r.Details.Select(d => new AttendanceDetailDto
                {
                    Id = d.Id,
                    StudentId = d.StudentId,
                    StudentName = d.Student.FullName,
                    ViolationCategoryId = d.ViolationCategoryId,
                    ViolationCategoryName = d.ViolationCategory != null ? d.ViolationCategory.Name : "Gatnaşdy (Düzgün bozma ýok)",
                    Note = d.Note
                }).ToList()
            })
            .ToListAsync();

        return Ok(records);
    }
}