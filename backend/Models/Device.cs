using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace backend.Models;

public class Device
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Manufacturer { get; set; }
    public int DeviceTypeId { get; set; }

    [ForeignKey("DeviceTypeId")]
    public DeviceType? DeviceType { get; set; }

    public string? OperatingSystem { get; set; }
    public string? OsVersion { get; set; }
    public string? Processor { get; set; }
    public int RamAmount { get; set; }
    public string? Description { get; set; }

    public int? CurrentUserId { get; set; }

    [ForeignKey("CurrentUserId")]
    public User? CurrentUser { get; set; }
}