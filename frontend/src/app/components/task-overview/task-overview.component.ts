import { Component } from '@angular/core';
import {TaskStateService} from '../../services/task-state.service';
import {Task} from '../../models/task.model';
import {Observable } from 'rxjs';
import {TaskItemComponent, TaskUpdateEvent} from '../task-item/task-item.component';
import {AsyncPipe, CommonModule} from '@angular/common';
import {Card} from 'primeng/card';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';


@Component({
  selector: 'app-task-overview',
  standalone: true,
  templateUrl: './task-overview.component.html',
  imports: [
    CommonModule,
    TaskItemComponent,
    AsyncPipe,
    Card,
    FormsModule,
    Button,
    ProgressSpinner
  ],
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent {
  tasks$: Observable<Array<Task>>
  isLoading$: Observable<boolean>

  newTaskTitle = '';
  newTaskDescription = '';
  showAddForm = false;

  constructor(
    public taskState: TaskStateService,
  ) {
    this.tasks$ = this.taskState.tasks$;
    this.isLoading$ = this.taskState.isLoading$;
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();
    const description = this.newTaskDescription.trim();

    if (!title) {
      alert('title needed');
      return;
    }

    this.taskState.addTask(title, description)
      .subscribe({
        next: (newTask) => {
          this.resetForm();
        },
        error: (error) => {
          console.error('error while adding a task:', error);
        }
      });
  }

  resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.showAddForm = false;
  }

  onTaskUpdated(event: TaskUpdateEvent): void {
    this.taskState.updateTask(event.taskId, event.updates)
      .subscribe({
        error: (error) => {
          console.error('error while updating a task:', error);
        }
      });
  }

  onTaskDeleted(taskId: string): void {
    if (confirm('delete task?')) {
      this.taskState.deleteTask(taskId)
        .subscribe({
          error: (error) => {
            console.error('error while deleting task:', error);
            alert('error while deleting task');
          }
        });
    }
  }

  onGenerateAiNote(taskId: string): void {
    this.taskState.generateAiNote(taskId)
      .subscribe({
        error: (error) => {
          console.error('error while generation ai note', error);
        }
      });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
}
