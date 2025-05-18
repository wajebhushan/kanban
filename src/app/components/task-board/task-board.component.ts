import { Component, computed, effect, inject } from '@angular/core';
import { ColumnBoardComponent } from '../column-board/column-board.component';
import { TaskStore } from '../../data-access/task.store';
import { Dialog } from '@angular/cdk/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [ColumnBoardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
})
export class TaskBoardComponent {
  taskStore = inject(TaskStore);
  statuses = ['To Do', 'In Progress', 'Done'];
  dialog = inject(Dialog);
  tasks = computed(() => this.taskStore.taskList());

  constructor() {
    this.taskStore.loadTasks();
  }

  openCreateTaskDialog() {
    const ref = this.dialog.open(AddTaskDialogComponent);

    ref.closed.subscribe((result) => {
      if (result) {
        const newTask: any = {
          ...result,
          id: crypto.randomUUID(),
        };
        this.taskStore.addTask(newTask);
      }
    });
  }
}
