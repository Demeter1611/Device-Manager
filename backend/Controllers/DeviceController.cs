using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using backend.Services;
using backend.DTOs;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DeviceController: ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AiService _aiService;

    public DeviceController(AppDbContext context, AiService aiService)
    {
        _context = context;
        _aiService = aiService;
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

        _context.Entry(existing).Property(x => x.CurrentUserId).IsModified = false;

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

    [HttpPost("generate-description")]
    public async Task<IActionResult> GenerateDescription([FromBody] DeviceReadDto device)
    {
        string prompt = $""""
            You are a technical expert.
            Write a natural, professional 1 sentence describing the device below for a non-technical user.
            Device details:
            - Name: {device.Name}
            - Manufacturer: {device.Manufacturer}
            - Specs: {device.Processor} processor, {device.RamAmount}GB RAM
            - OS: {device.OperatingSystem} {device.OsVersion}
            
            You must evaluate the hardware to determine the device's actual capability.
            Evaluation Rules:

            - LEGACY (<=4GB RAM): Focus on basic documentation, communication, email management and the need for patience.
            - STANDARD (8-12GB RAM): Focus on smooth office workflows and web-heavy tasks. Also it is balanced for many use cases such as video calls or the ones mentioned before
            - HIGH-END (>12GB RAM or Flagship CPU): Focus on absolute speed and heavy professional processing.

            -Write it as a single, fluid sentence.
            -Do not list hardware specs as technical data unless they significantly define the device
            -Focus on the device's feel and capability, not its numbers.
            -Do not mention: gaming, hobbies, entertainment, movies, or personal passions.
            -Vary the structure. start with the name. Use verbs or adjectives to lead.
            -No numbers from specs
            -Jump straight to the point.
            BANNED WORDS: dependable, reliable, essential, perfect, great.
        """";
        var aiResponse = await _aiService.AskAsync(prompt);
        return Ok(new { description = aiResponse });
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<DeviceReadDto>>> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return await GetDevices();
        }

        var cleanQuery = new string(query.Where(c => !char.IsPunctuation(c)).ToArray()).ToLower();

        var tokens = cleanQuery.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        var allDevices = await _context.Devices
            .Include(d => d.DeviceType)
            .Include(d => d.CurrentUser)
            .ToListAsync();
        
        var rankedResults = allDevices.Select(device => new { Device = device, Score = CalculateScore(device, tokens)})
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .ThenBy(x => x.Device.Name)
            .Select(x => x.Device.MapToReadDto())
            .ToList();
        
        return Ok(rankedResults);
    }

    private int CalculateScore(Device device, string[] tokens)
    {
        int score = 0;
        foreach (var token in tokens)
        {
            bool foundMatchForCurrentToken = false;
            if(device.Name.Contains(token, StringComparison.OrdinalIgnoreCase))
            {
                score += 10;
                foundMatchForCurrentToken = true;
            }
            if(device.Manufacturer.Contains(token, StringComparison.OrdinalIgnoreCase))
            {
                score += 5;
                foundMatchForCurrentToken = true;
            }
            if(device.Processor.Contains(token, StringComparison.OrdinalIgnoreCase))
            {
                score += 3;
                foundMatchForCurrentToken = true;
            }

            string numericToken = token.Replace("gb", "");

            if (device.RamAmount.ToString() == numericToken)
            {
                score += 1;
                foundMatchForCurrentToken = true;
            } else if (token == "gb")
            {
                foundMatchForCurrentToken = true;
            }

            if (!foundMatchForCurrentToken)
            {
                return 0;
            }
        }
        return score;
    }
}