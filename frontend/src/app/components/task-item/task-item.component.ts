import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Task } from '../../models/task.model';
import {CommonModule} from '@angular/common';
import {Checkbox} from 'primeng/checkbox';
import {FormsModule, StatusChangeEvent} from '@angular/forms';
import {Button} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TaskStatus} from '../../enums/task-status.enum';

export interface TaskUpdateEvent {
  taskId: string;
  updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
  };
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, DropdownModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {

  @Input({ required: true }) task!: Task;
  @Input() isLoading = false;

  @Output() taskDeleted = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<StatusChangeEvent>();
  @Output() aiNoteRequested= new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<TaskUpdateEvent>();

  isEditMode = false;
  editTitle = '';
  editDescription = '';
  editStatus: TaskStatus = TaskStatus.TODO;

  isGeneratingAiNote = false;

  statusOptions = [
    { label: 'Open', value: TaskStatus.TODO },
    { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
    { label: 'Done', value: TaskStatus.DONE }
  ];

  get statusLabel(): string {
    const option = this.statusOptions.find(
      option => option.value === this.task.status);
    return option?.label || this.task.status;
  }

  deleteTask(): void {
    this.taskDeleted.emit(this.task.id!);
  }

  startEdit(): void {
    this.isEditMode = true;
    this.editTitle = this.task.title;
    this.editDescription = this.task.description;
    this.editStatus = this.task.status;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editTitle = '';
    this.editDescription = '';
  }

  saveEdit(): void {
    if (!this.editTitle.trim()) {
      return;
    }

    const updates = {
      title: this.editTitle.trim(),
      description: this.editDescription.trim(),
      status: this.editStatus
    };

    this.taskUpdated.emit({
      taskId: this.task.id!,
      updates
    });

    this.isEditMode = false;
  }

  generateAiNote(): void {
    this.isGeneratingAiNote = true;
    this.aiNoteRequested.emit(this.task.id!);
  }

  protected readonly TaskStatus = TaskStatus;
}
