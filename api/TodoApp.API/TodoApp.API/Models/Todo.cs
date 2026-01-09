namespace TodoApp.API.Models
{
  public class Todo
  {
    public int id { get; set; }
    public string taskName { get; set; }
    public bool isCompleted { get; set; }
    public bool isEditable { get; set; }
  }
}
