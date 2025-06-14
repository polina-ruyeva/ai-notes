import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Task } from '../models/task.model';
import {CreateTaskRequest} from '../models/create-task-request.model';
import {UpdateTaskRequest} from '../models/update-task-request.model';
import {GenerateNoteResponse} from '../models/generate-note-response.model';

@Injectable({
  providedIn: 'root'
})

export class TaskDataService {

  constructor(private httpClient: HttpClient) {}

  public getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${environment.apiUrl}/tasks`);
  }

  public getTask(id: string): Observable<Task> {
    return this.httpClient.get<Task>(`${environment.apiUrl}/tasks/${id}`);
  }

  public createTask(taskDataRequest: CreateTaskRequest): Observable<Task> {
    return this.httpClient.post<Task>(`${environment.apiUrl}/tasks`, taskDataRequest);
  }

  public updateTask(id: string, updates: UpdateTaskRequest): Observable<Task> {
    return this.httpClient.put<Task>(`${environment.apiUrl}/tasks/${id}`, updates);
  }

  public deleteTask(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/tasks/${id}`);
  }

  public generateNote(id: string): Observable<GenerateNoteResponse> {
    return this.httpClient.post<GenerateNoteResponse>(`${environment.apiUrl}/tasks/${id}/generate-note`, {});
  }
}
