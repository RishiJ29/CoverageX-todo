import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { delay, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly baseUrl = 'http://localhost:8080/api/tasks';  // proxied to backend
  tasks = signal<Task[]>([]);               // global signal state

  constructor(private http: HttpClient) {}

   fetchTasks(limit = 5, date?: string, query?: string): Observable<Task[]> {
     let params = new HttpParams().set('limit', limit.toString());
     if (date) params = params.set('date', date);
     if (query) params = params.set('q', query);

     return this.http.get<Task[]>(this.baseUrl, { params }).pipe(
       tap(tasks => this.tasks.set(tasks))
    );
   }

  /** Create a new task */
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(() => this.refresh())
    );
  }

  /** Mark a task as completed */
  completeTask(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/complete`, {}).pipe(
      tap(() => this.refresh())
    );
  }

  /** Update/extend an existing task */
  updateTask(id: number, payload: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, payload).pipe(
      tap(() => this.refresh())
    );
  }


  /** Internal helper — refresh tasks with defaults */
  refresh(): Observable<Task[]> {
    return this.fetchTasks();
 }

}
