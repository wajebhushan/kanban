import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../model/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
    private readonly BASE_URL = 'http://localhost:3000/tasks';

  httpGetApi() {
    return this.http.get<Task[]>(this.BASE_URL);
  }

  addTask(task: Task) {
    return this.http.post<Task>(this.BASE_URL, task);
  }
  updateTask(task: Task){
  return this.http.patch<Task>(`http://localhost:3000/tasks/${task.id}`, {
    status: task.status
  });
}


}
