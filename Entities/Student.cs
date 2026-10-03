namespace Oguz_Nyzam.API.Entities;

public class Student
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string FullName { get; set; } = string.Empty;

    public int StudentCardNumber { get; set; }

    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;


}