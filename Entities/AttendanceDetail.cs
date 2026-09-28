namespace Oguz_Nyzam.API.Entities;

public class AttendanceDetail
{
    public Guid  Id { get; set; } = Guid.NewGuid();

    public Guid AttendanceRecordId { get; set; }
    public AttendanceRecord AttendanceRecord { get; set; } = null!;

    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public int? ViolationCategoryId { get; set; }
    public ViolationCategory? ViolationCategory { get; set; }

    public string? Note { get; set; }
}