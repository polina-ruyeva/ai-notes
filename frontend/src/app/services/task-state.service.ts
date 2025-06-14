import {Injectable, OnInit} from '@angular/core';
import {Task} from '../models/task.model';
import {BehaviorSubject, catchError, EMPTY, finalize, map, Observable, of, tap} from 'rxjs';
import { TaskDataService} from './task-data.service';
import {TaskStatus} from '../enums/task-status.enum';
import {CreateTaskRequest} from '../models/create-task-request.model';
import {UpdateTaskRequest} from '../models/update-task-request.model';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  private tasksBehaviourSubject = new BehaviorSubject<Task[]>([]);
  private isLoadingBehaviorSubject = new BehaviorSubject<boolean>(false);

  tasks$ = this.tasksBehaviourSubject.asObservable();
  isLoading$ = this.isLoadingBehaviorSubject.asObservable();

  constructor(
    private taskDataService: TaskDataService
  ) {
    this.loadTasks().subscribe();
  }

  loadTasks(): Observable<Task[]> {
    this.setLoading(true);

    return this.taskDataService.getTasks().pipe(
      tap(tasks => {
        const tasksWithDates = tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt!),
          updatedAt: new Date(task.updatedAt!)
        }));
        this.tasksBehaviourSubject.next(tasksWithDates);
      }),
      catchError(error => {
        console.error('error loading tasks:', error);
        return of([]);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  addTask(title: string, description: string = ''): Observable<Task> {
    const request: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim(),
      status: TaskStatus.TODO
    };
    this.setLoading(true);

    return this.taskDataService.createTask(request).pipe(
      tap(newTask => {
        const newTaskWithDates = {
          ...newTask,
          createdAt: new Date(newTask.createdAt!),
          updatedAt: new Date(newTask.updatedAt!)
        };
        const currentTasks = this.currentTasks;
        this.tasksBehaviourSubject.next([...currentTasks, newTaskWithDates]);
      }),
      catchError(error => {
        console.error('error creating task:', error);
        return EMPTY;
      }),
      finalize(() => this.setLoading(false))
    );
  }

  get currentTasks(): Task[] {
    return this.tasksBehaviourSubject.value;
  }

  private setLoading(loading: boolean): void {
    this.isLoadingBehaviorSubject.next(loading);
  }

  updateTask(taskId: string, updates: {
    title?: string;
    description?: string;
    status?: TaskStatus
  }): Observable<Task> {
    this.setLoading(true);

    const updateRequest: UpdateTaskRequest = {};

    if (updates.title !== undefined) {
      updateRequest.title = updates.title;
    }
    if (updates.description !== undefined) {
      updateRequest.description = updates.description;
    }
    if (updates.status !== undefined) {
      updateRequest.status = updates.status;
    }

    return this.taskDataService.updateTask(taskId, updateRequest).pipe(
      tap(updatedTask => {
        const updatedTaskWithDates = {
          ...updatedTask,
          createdAt: new Date(updatedTask.createdAt!),
          updatedAt: new Date(updatedTask.updatedAt!)
        };

        const currentTasks = this.currentTasks;
        const index = currentTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          const newTasks = [...currentTasks];
          newTasks[index] = updatedTaskWithDates;
          this.tasksBehaviourSubject.next(newTasks);
        }
      }),
      map(updatedTask => ({
        ...updatedTask,
        createdAt: new Date(updatedTask.createdAt!),
        updatedAt: new Date(updatedTask.updatedAt!)
      })),
      catchError(error => {
        console.error('error updating task:', error);
        return EMPTY;
      }),
      finalize(() => this.setLoading(false))
    );
  }

  deleteTask(taskId: string): Observable<boolean> {
    this.setLoading(true);

    return this.taskDataService.deleteTask(taskId).pipe(
      tap(() => {
        const currentTasks = this.currentTasks;
        const newTasks = currentTasks.filter(task => task.id !== taskId);
        this.tasksBehaviourSubject.next(newTasks);
      }),
      map(() => true),
      catchError(error => {
        console.error('error deleting task:', error);
        return of(false);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  generateAiNote(taskId: string): Observable<string> {
    return this.taskDataService.generateNote(taskId).pipe(
      tap(response => {
        const currentTasks = this.currentTasks;
        const index = currentTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          const newTasks = [...currentTasks];
          newTasks[index] = {
            ...newTasks[index],
            aiNote: response.aiNote,
            updatedAt: new Date()
          };
          this.tasksBehaviourSubject.next(newTasks);
        }
      }),
      map(response => response.aiNote),
      catchError(error => {
        console.error('error while generating AI note:', error);
        return of('error while generating ai task');
      }),
      finalize(() => this.setLoading(false))
    );
  }
}
