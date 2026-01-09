// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../app/todolist/todolist.service'
import { Todo } from '../app/todolist/todolist.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit {
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {} 

}
