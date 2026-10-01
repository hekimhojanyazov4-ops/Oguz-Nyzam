namespace Oguz_Nyzam.API.DTOs;

public class CreateFacultyDto
{
    public string Name { get; set; } = string.Empty;
}

public class FacultyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}