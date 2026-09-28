namespace Oguz_Nyzam.API.Entities;

public class Course
{
    public int Id { get; set; }

    public string CourseNumber { get; set; } = string.Empty;

    public int FacultyId { get; set; }
    public Faculty Faculty { get; set; } = null!;

    public ICollection<Group> Groups { get; set; } = new List<Group>();
}