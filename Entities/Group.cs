namespace Oguz_Nyzam.API.Entities;

public class Group
{
    public int Id { get; set; }

    public int GroupNumber { get; set; }

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public ICollection<Student> Students { get; set; } = new List<Student>();
}