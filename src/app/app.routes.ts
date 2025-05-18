import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
          import('./components/task-board/task-board.component').then(m => m.TaskBoardComponent)
      }
];
