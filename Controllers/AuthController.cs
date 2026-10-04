using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Data;
using Oguz_Nyzam.API.DTOs;
using Oguz_Nyzam.API.Entities;
using Oguz_Nyzam.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using Oguz_Nyzam.API.Resources;

namespace Oguz_Nyzam.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenGenerator _jwtTokenGenerator;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public AuthController(
        AppDbContext context,
        JwtTokenGenerator jwtTokenGenerator,
        IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _localizer = localizer;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        var existingFaculty = await _context.Faculties.AnyAsync(f => f.Id == dto.FacultyId);
        if (!existingFaculty)
            return BadRequest(_localizer["FacultyNotFound"]);

        var existingUser = await _context.Users.AnyAsync(u => u.FullName == dto.FullName);
        if (existingUser) 
            return BadRequest(_localizer["UserAlreadyRegistered"]);
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            FacultyId = dto.FacultyId,
            PasswordHash = dto.Password,
            RoleId = null,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            FacultyId = user.FacultyId,
            RoleId = null,
            Token = string.Empty
        });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _context.Users
            .Include(r => r.Role)
            .FirstOrDefaultAsync(r => r.FullName == dto.FullName && r.PasswordHash == dto.Password);
        
        if (user == null)
            return Unauthorized(_localizer["InvalidCredentials"]);
        
        if (user.RoleId == null)
            return BadRequest(_localizer["AccountPendingApproval"]);
        
        var token = _jwtTokenGenerator.GenerateToken(user);

        return Ok(new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            FacultyId = user.FacultyId,
            RoleId = user.Role!.Id,
            Token = token
        });
    }
}