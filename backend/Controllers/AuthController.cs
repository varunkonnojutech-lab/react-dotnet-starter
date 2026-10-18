using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly PasswordHasher _hasher;
    private readonly JwtTokenService _tokens;

    public AuthController(AppDbContext db, PasswordHasher hasher, JwtTokenService tokens)
    {
        _db = db;
        _hasher = hasher;
        _tokens = tokens;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return Conflict(new { message = "Username is already taken." });
        }

        var (hash, salt) = _hasher.HashPassword(dto.Password);
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponseDto(_tokens.GenerateToken(user)));
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user is null || !_hasher.Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        return Ok(new AuthResponseDto(_tokens.GenerateToken(user)));
    }
}
