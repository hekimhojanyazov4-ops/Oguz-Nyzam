using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Oguz_Nyzam.API.Resources;

namespace Oguz_Nyzam.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public UsersController(AppDbContext context, IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _localizer = localizer;
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
            return NotFound(_localizer["UserNotFound"]);
        
        var role = await _context.Roles.FindAsync(dto.RoleId);
        if (role == null)
            return NotFound(_localizer["RoleNotFound"]);

        user.RoleId = dto.RoleId;
        await _context.SaveChangesAsync();

        var roleName = role.Id switch
        {
            1 => _localizer["RoleNameAdministrator"].Value,
            2 => _localizer["RoleNameDean"].Value,
            3 => _localizer["RoleNameDeputyDean"].Value,
            _ => role.Name
        };
        return Ok(_localizer["RoleAssigned", user.FullName, roleName].Value);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "1")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(_localizer["UserNotFound"]);

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}