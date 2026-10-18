using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _db;

    public TodosController(AppDbContext db)
    {
        _db = db;
    }

    private int CurrentUserId
    {
        get
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value;
            return int.Parse(id ?? throw new UnauthorizedAccessException("Missing user id claim."));
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoDto>>> GetAll()
    {
        var userId = CurrentUserId;
        var todos = await _db.Todos
            .Where(t => t.UserId == userId)
            .AsNoTracking()
            .ToListAsync();

        return Ok(todos.Select(t => new TodoDto(t.Id, t.Title, t.IsDone)));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoDto>> GetById(int id)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        return todo is null
            ? NotFound()
            : Ok(new TodoDto(todo.Id, todo.Title, todo.IsDone));
    }

    [HttpPost]
    public async Task<ActionResult<TodoDto>> Create(CreateTodoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest(new { message = "Title is required." });
        }

        var todo = new Todo { Title = dto.Title.Trim(), UserId = CurrentUserId };
        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = todo.Id },
            new TodoDto(todo.Id, todo.Title, todo.IsDone));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateTodoDto dto)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (todo is null)
        {
            return NotFound();
        }

        todo.Title = dto.Title;
        todo.IsDone = dto.IsDone;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await _db.Todos
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (todo is null)
        {
            return NotFound();
        }

        _db.Todos.Remove(todo);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
