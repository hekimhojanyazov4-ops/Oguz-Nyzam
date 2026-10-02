using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;
using Microsoft.AspNetCore.Authorization;

namespace Oguz_Nyzam.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "1")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                FacultyId = u.FacultyId,
                RoleId = u.Role != null ? u.Role.Id : null
            }).ToListAsync();

        return Ok(users);
    }

    [HttpPost("assign-role")]
    [Authorize(Roles = "1")]
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

    [HttpDelete("{id}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound("User tapylmady.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}