import {TaskStatus} from '../enums/task-status.enum';

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: TaskStatus;
}
