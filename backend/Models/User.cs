using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class User
{
    public int Id{ get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
    public int RoleId { get; set; }

    [ForeignKey("RoleId")]
    public Role? Role { get; set; }
    public string? Location { get; set; }

    public ICollection<Device> Devices { get; set; } = new List<Device> ();
}