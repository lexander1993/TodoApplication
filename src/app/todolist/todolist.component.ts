import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todolist/todolist.service'
import { Todo } from '../todolist/todolist.model';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  tasks: Todo[] = [];
  taskName: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  // Fetch tasks from the API
  getTodos(): void {
    this.todoService.getTodos().subscribe(
      (data) => {
        this.tasks = data;
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  // Function to add a new task
  onSubmit(taskForm: any): void {
    if (taskForm.valid) {
      const newTask: Todo = {
        id: 0,  // ID is set by the API on creation
        taskName: taskForm.value.taskName,
        isEditable: false,
        isCompleted: false
      };
  
      this.todoService.addTodo(newTask).subscribe(
        (data: Todo | Todo[]) => {  
          if (Array.isArray(data)) {
            data.forEach(task => {
              if (!this.tasks.some(existingTask => existingTask.id === task.id)) {
                this.tasks.push(task);
              }
            });
          } else {
            // If it's a single task, check if it already exists before adding it
            if (!this.tasks.some(existingTask => existingTask.id === data.id)) {
              this.tasks.push(data);
            }
          }
          taskForm.reset(); 
        },
        (error) => {
          console.error('Error adding task', error);
        }
      );
    }
  }
  
  deleteTask(taskId: number): void {
    this.todoService.deleteTodo(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId); // Remove from UI after deletion
      },
      (error) => {
        console.error('Error deleting task', error);
      }
    );
  }

  // Function to toggle edit mode for a task
  editTask(index: number): void {
    this.tasks[index].isEditable = true;
  }

  // Function to save the edited task
  saveTask(taskId: number, index: number, newTaskName: string): void {

      const updatedTask: Partial<Todo> = {
        taskName: newTaskName, 
      };
      
      this.todoService.updateTodo(taskId, updatedTask).subscribe(
        (data) => {
        
          // Merge old task with updated data
          this.tasks[index] = { ...this.tasks[index], ...data };
          this.tasks[index].isEditable = false; // Exit edit mode
        
          console.log('Updated task:', newTaskName);
        },
        (error) => {
          console.error('Error updating task', error);
        }
      );

  }

  // Function to toggle completion status of a task
  toggleCompletion(taskId: number, index: number, newisCompleted: boolean): void {
    const updatedTask: Partial<Todo> = { taskName: this.tasks[index].taskName,  isCompleted: newisCompleted, };
  
    this.todoService.updateTodo(taskId, updatedTask).subscribe(
      (data) => {
        // Update task locally to reflect the changes
        this.tasks[index] = { ...this.tasks[index], ...data };
        console.log('Task completion updated:', newisCompleted);
      },
      (error) => {
        console.error('Error updating task completion status', error);
      }
    );
  }


  
}