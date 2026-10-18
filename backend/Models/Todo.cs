namespace Backend.Models;

public class Todo
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public bool IsDone { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }
}
