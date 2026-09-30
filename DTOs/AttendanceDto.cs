namespace Oguz_Nyzam.API.DTOs;

public class CreateAttendanceDetailDto
{
    public Guid StudentId { get; set; }
    public int? ViolationCategoryId { get; set; }
    public string? Note { get; set; }
}

public class CreateAttendanceRecordDto
{
    public DateTime Date { get; set; }
    public int GroupId { get; set; }
    public Guid TeacherId { get; set; }
    public List<CreateAttendanceDetailDto> Details { get; set; } = new();
}

public class AttendanceDetailDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int? ViolationCategoryId { get; set; }
    public string? ViolationCategoryName { get; set; }
    public string? Note { get; set; }
}

public class AttendanceRecordDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public int GroupId { get; set; }
    public int GroupNumber { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public bool IsSubmitted { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public List<AttendanceDetailDto> Detail { get; set; } = new();
}