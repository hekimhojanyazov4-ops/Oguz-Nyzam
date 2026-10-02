// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;
// using Microsoft.IdentityModel.Tokens;
// using Oguz_Nyzam.API.Entities;

// namespace Oguz_Nyzam.API.Services;

// public class JwtTokenGenerator
// {
//     private readonly IConfiguration _configuration;

//     public JwtTokenGenerator(IConfiguration configuration)
//     {
//         _configuration = configuration;
//     }

//     public string GenerateToken(User user)
//     {
//         var secretKey = _configuration["JwtSettings:Secret"];
//         var issuer = _configuration["JwtSettings:Issuer"];
//         var audience = _configuration["JwtSettings:Audience"];
//         var expiryMinutes = Convert.ToDouble(_configuration["JwtSettings:ExpiryMinutes"]);

//         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
//         var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//         var claims = new[]
//         {
//             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//             new Claim(ClaimTypes.Name, user.FullName),
//             new Claim("FacultyId", user.FacultyId.ToString()),
//             new Claim(ClaimTypes.Role, user.Role)
//         };

//         var token = new JwtSecurityToken(
//             issuer: issuer,
//             audience: audience,
//             claims: claims,
//             expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
//             signingCredentials: creds
//         );

//         return new JwtSecurityTokenHandler().WriteToken(token);
//     }
// }