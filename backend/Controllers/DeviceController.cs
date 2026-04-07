using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
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
    public async Task<ActionResult<DeviceReadDto>> PostDevice(Device device)
    {
        _context.Devices.Add(device);
        await _context.SaveChangesAsync();
        
        var dto = device.MapToReadDto();

        return CreatedAtAction(nameof(GetDevice), new { id = device.Id }, dto);   
    }

    [HttpPut("{id}")]
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