using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController: ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserReadDto>>> GetUsers()
    {
        var users = await _context.Users
            .ProjectToReadDto()
            .ToListAsync();
        
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserReadDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .ProjectToReadDto()
            .FirstOrDefaultAsync();
        
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserReadDto>> PostUser(User user)
    {   
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        await _context.Entry(user).Reference(u => u.Role).LoadAsync();

        var dto = user.MapToReadDto();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, User user)
    {
        if(id != user.Id)
        {
            return BadRequest("ID in URL doesn't match ID in body");
        }

        var existing = await _context.Users.FindAsync(id);
        if(existing == null)
            return NotFound();
        
        _context.Entry(existing).CurrentValues.SetValues(user);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if(user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}