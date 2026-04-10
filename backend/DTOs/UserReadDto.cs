namespace backend.DTOs;

public class UserReadDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public List<string> DeviceNames { get; set; } = new List<string>();
}