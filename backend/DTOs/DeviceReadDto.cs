namespace backend.DTOs;

public class DeviceReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Manufacturer { get; set; }
    public string DeviceTypeName { get; set; } = string.Empty;
    public string? OperatingSystem { get; set; }
    public string? OsVersion { get; set; }
    public string? Processor { get; set; }
    public int RamAmount { get; set; }
    public string? Description { get; set; }
    public string? CurrentUserFullName { get; set; }

}