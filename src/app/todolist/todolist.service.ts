import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todolist.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:5246/api/todo'; 

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  addTodo(todo: Partial<Todo>): Observable<Todo[]> {
    return this.http.post<Todo[]>(this.apiUrl, todo);
  }
  deleteTodo(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;  
    return this.http.delete<void>(url);  
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    const url = `${this.apiUrl}/${id}`;  
    return this.http.put<Todo>(url, todo);  
  }

}
