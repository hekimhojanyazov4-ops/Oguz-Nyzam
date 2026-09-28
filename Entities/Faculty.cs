namespace Oguz_Nyzam.API.Entities;

public class Faculty
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Course> Courses { get; set; } = new List<Course>();
}