using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using backend.DTOs;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DeviceController: ControllerBase
{
    private readonly AppDbContext _context;

    public DeviceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeviceReadDto>>> GetDevices()
    {
        var devices =  await _context.Devices
            .ProjectToReadDto()
            .ToListAsync();
        
        return Ok(devices);

    }

    [HttpGet("check-exists")]
    public async Task<ActionResult<bool>> CheckNameExists([FromQuery] string name, [FromQuery] int? excludeId = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest("Name is required for checking.");    
        }
        
        var normalizedName = name.Trim().ToLower();
        bool exists = await _context.Devices
            .AnyAsync(d => d.Name.ToLower() == normalizedName &&
                (excludeId == null || d.Id != excludeId));
        return Ok(exists);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DeviceReadDto>> GetDevice(int id)
    {
        var device = await _context.Devices
            .Where(d => d.Id == id)
            .ProjectToReadDto()
            .FirstOrDefaultAsync();
        
        if (device == null)
            return NotFound();
        
        return Ok(device);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<DeviceReadDto>> PostDevice(Device device)
    {
        _context.Devices.Add(device);
        await _context.SaveChangesAsync();

        await _context.Entry(device).Reference(d => d.DeviceType).LoadAsync();
    
        if (device.CurrentUserId != null)
        {
            await _context.Entry(device).Reference(d => d.CurrentUser).LoadAsync();
        }
        
        var dto = device.MapToReadDto();

        return CreatedAtAction(nameof(GetDevice), new { id = device.Id }, dto);   
    }

    [HttpPut("assign/{deviceId}")]
    public async Task<IActionResult> AssignDevice(int deviceId)
    {   
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized();
        }
        int currentUserId = int.Parse(userIdClaim);

        var device = await _context.Devices.FindAsync(deviceId);

        if(device == null)
        {
            return NotFound("Device not found.");
        }
        if (device.CurrentUserId != null)
        {
            return BadRequest("This device is already assigned to another user");
        }

        device.CurrentUserId = currentUserId;

        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpPut("unassign/{deviceId}")]
    public async Task<IActionResult> UnassignDevice(int deviceId)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized();
        }

        int currentUserId = int.Parse(userIdClaim);

        var device = await _context.Devices.FindAsync(deviceId);
        if(device == null)
        {
            return NotFound("Device not found.");
        }
        if(device.CurrentUserId != currentUserId)
        {
            return BadRequest("You can only unassign your own devices.");
        }

        device.CurrentUserId = null;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> PutDevice(int id, Device device)
    {
        if(id != device.Id)
        {
            return BadRequest("ID in URL doesn't match ID in body");
        }

        var existing = await _context.Devices.FindAsync(id);
        if(existing == null)
            return NotFound();
        _context.Entry(existing).CurrentValues.SetValues(device);

        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteDevice(int id)
    {
        var device = await _context.Devices.FindAsync(id);

        if (device == null)
        {
            return NotFound();
        }

        _context.Devices.Remove(device);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}