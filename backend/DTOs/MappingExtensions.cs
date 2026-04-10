using backend.Models;

namespace backend.DTOs;

public static class MappingExtensions
{
    public static DeviceReadDto MapToReadDto(this Device d)
    {
        return new DeviceReadDto
        {
            Id = d.Id,
            Name = d.Name,
            Manufacturer = d.Manufacturer,
            DeviceTypeName = d.DeviceType != null ? d.DeviceType.Name : "Unknown",
            OperatingSystem = d.OperatingSystem,
            OsVersion = d.OsVersion,
            Processor = d.Processor,
            RamAmount = d.RamAmount,
            Description = d.Description,
            CurrentUserFullName = d.CurrentUser != null ? d.CurrentUser.FullName : "Unassigned"
        };
    }

    public static IQueryable<DeviceReadDto> ProjectToReadDto(this IQueryable<Device> query)
    {
        return query.Select(d => new DeviceReadDto
        {
            Id = d.Id,
            Name = d.Name,
            Manufacturer = d.Manufacturer,
            DeviceTypeName = d.DeviceType != null ? d.DeviceType.Name : "Unknown",
            OperatingSystem = d.OperatingSystem,
            OsVersion = d.OsVersion,
            Processor = d.Processor,
            RamAmount = d.RamAmount,
            Description = d.Description,
            CurrentUserFullName = d.CurrentUser != null ? d.CurrentUser.FullName : "Unassigned"
        });
    }

    public static UserReadDto MapToReadDto(this User u)
    {
        return new UserReadDto
        {
            Id = u.Id,
            Email = u.Email,
            FullName = u.FullName,
            RoleName = u.Role != null ? u.Role.Name : "Unknown",
            DeviceNames = u.Devices.Select(d => d.Name).ToList()
        };
    }

    public static IQueryable<UserReadDto> ProjectToReadDto(this IQueryable<User> query)
    {
        return query.Select(u => new UserReadDto
        {
            Id = u.Id,
            Email = u.Email,
            FullName = u.FullName,
            RoleName = u.Role != null ? u.Role.Name : "Unknown",
            DeviceNames = u.Devices.Select(d => d.Name).ToList()
        });
    }
}
