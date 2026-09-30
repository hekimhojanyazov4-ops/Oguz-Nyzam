using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;

namespace Oguz_Nyzam.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                RoleName = u.Role != null ? u.Role.Name : "Rol berilmedik"
            }).ToListAsync();

        return Ok(users);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.FullName == dto.FullName);
        if (existingUser != null)
            return BadRequest("Bu Ulanyjy ady eyyam registrasiya edilen.");
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            PasswordHash = dto.Password,
            RoleId = null
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            RoleName = "Rol Berilmedik"
        });
    }

    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole(AssignRoleDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null)
            return NotFound("Ulanyjy tapylmady.");
        
        var role = await _context.Roles.FindAsync(dto.RoleId);
        if (role == null)
            return NotFound("Role tapylmady.");

        user.RoleId = dto.RoleId;
        await _context.SaveChangesAsync();

        return Ok($"'{user.FullName}' ulanyjysyna '{role.Name}' roly ustunlikli berildi");
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.FullName == dto.FullName && u.PasswordHash == dto.Password);
        if (user == null)
            return Unauthorized("Ulanyjy ady yada parol yalnys.");

        if (user.RoleId == null)
            return BadRequest("Sizin akkoundynyz intek Admin tarapyndan tassyklanmadyk.");
        
        return Ok(new UserDto
        {
           Id = user.Id,
           FullName = user.FullName,
           RoleName = user.Role!.Name 
        });
    }
}