import { Routes } from '@angular/router';
import {TaskItemComponent} from './components/task-item/task-item.component';
import {TaskOverviewComponent} from './components/task-overview/task-overview.component';

export const routes: Routes = [
  { path: '', component: TaskOverviewComponent },
];
