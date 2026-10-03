namespace Oguz_Nyzam.API.Entities;

public class AttendanceRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateOnly Date { get; set; }

    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public Guid TeacherId { get; set; }
    public User Teacher { get; set; } = null!;

    public bool IsSubmitted { get; set; } = false;

    public DateTime? SubmittedAt { get; set; }

    public ICollection<AttendanceDetail> Details { get; set; } = new List<AttendanceDetail>();
}