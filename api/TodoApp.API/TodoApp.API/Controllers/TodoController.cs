using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using TodoApp.API.Models;


namespace TodoApp.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TodoController : ControllerBase
  {
    private readonly IMemoryCache _memoryCache;
    private const string CacheKey = "Todos";

    public TodoController(IMemoryCache memoryCache)
    {
      _memoryCache = memoryCache;
    }

    // GET: api/todo
    [HttpGet]
    public IActionResult GetTodos()
    {
      if (_memoryCache.TryGetValue(CacheKey, out List<Todo> todos))
      {
        return Ok(todos);
      }
      return Ok(new List<Todo>());
    }

    // POST: api/todo
    [HttpPost]
    public IActionResult AddTodo([FromBody] Todo todo)
    {
      if (!_memoryCache.TryGetValue(CacheKey, out List<Todo> todos))
      {
        todos = new List<Todo>();
      }

      todo.id = todos.Count + 1; // Simple auto-increment
      todos.Add(todo);

      _memoryCache.Set(CacheKey, todos);
      return Ok(todos);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTodo(int id)
    {
      if (!_memoryCache.TryGetValue(CacheKey, out List<Todo> todos))
      {
        return NotFound("Todo list not found.");
      }

      var todoToRemove = todos.FirstOrDefault(t => t.id == id);
      if (todoToRemove == null)
      {
        return NotFound($"Todo with id {id} not found.");
      }

      todos.Remove(todoToRemove);
      _memoryCache.Set(CacheKey, todos); 
      return Ok(todos); 
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTodo(int id, [FromBody] Todo updatedTodo)
    {
      if (!_memoryCache.TryGetValue(CacheKey, out List<Todo> todos))
      {
        return NotFound("Todo list not found.");
      }

      var existingTodo = todos.FirstOrDefault(t => t.id == id);
      if (existingTodo == null)
      {
        return NotFound($"Todo with id {id} not found.");
      }

      if (!string.IsNullOrEmpty(updatedTodo.taskName))
      {
        existingTodo.taskName = updatedTodo.taskName;
      }
        existingTodo.isCompleted = updatedTodo.isCompleted;

      _memoryCache.Set(CacheKey, todos);
      return Ok(existingTodo); 
    }


  }
  }
