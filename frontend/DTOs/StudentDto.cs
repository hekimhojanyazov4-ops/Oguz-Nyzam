namespace Oguz_Nyzam.API.DTOs;

public class CreateStudentDto
{
    public string FullName { get; set; } = string.Empty;
    public int StudentCardNumber { get; set; }
    public int GroupId { get; set; }
}

public class UpdateStudentDto
{
    public string FullName { get; set; } = string.Empty;
    public int StudentCardNumber { get; set; }
    public int GroupId { get; set; }
}

public class StudentDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int StudentCardNumber { get; set; }
    public int GroupId { get; set; }
}