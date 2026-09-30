namespace Oguz_Nyzam.API.DTOs;

public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AssignRoleDto
{
    public Guid UserId { get; set; }
    public int RoleId { get; set; }
}

public class LoginDto
{
    public string FullName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? RoleName { get; set; }
}