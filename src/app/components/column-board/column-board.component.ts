import { Component, effect, inject, input, Input } from '@angular/core';
import { Task, TaskStatus } from '../../model/task.model';
import {
  CdkDropList,
  CdkDragDrop,
  transferArrayItem,
  DragDropModule,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskStore } from '../../data-access/task.store';

@Component({
  selector: 'app-column-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, CdkDropList, TaskCardComponent],
  templateUrl: './column-board.component.html',
  styleUrl: './column-board.component.css',
  providers: [TaskStore],
  host: {
    cdkDrag: '', // Entire card is draggable
  },
})
export class ColumnBoardComponent {
  tasks = input<any>([]);
  status = input<any>();
  allTasks = input<any>();
  taskStore = inject(TaskStore);
  allStatuses = ['To Do', 'In Progress', 'Done'];
  connectedDropLists = this.allStatuses.map((status) => this.toListId(status));

  toListId(status: string): string {
    return status.replace(/\s/g, '') + 'List';
  }

  constructor() {
    effect(() => {
      const task = this.tasks();
      if (task) {
        console.log('task: ', task);
      }
    });
  }

  fromListId(id: string): string {
    return this.allStatuses.find((s) => this.toListId(s) === id) || 'To Do';
  }

  get tasksInThisColumn(): Task[] {
    return this.tasks().filter((task: any) => task.status === this.status());
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;
    const movedTask = prevList[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
      this.taskStore.reorderTask([...currList], this.status());
    } else {
      transferArrayItem(
        prevList,
        currList,
        event.previousIndex,
        event.currentIndex
      );
      const newStatus = this.fromListId(event.container.id);
      const updatedTask: any = { ...movedTask, status: newStatus };
      this.taskStore.updateTaskOnServer(updatedTask);
    }
  }
  statusClass(status: string) {
    return {
      'todo-column': status === 'To Do',
      'inprogress-column': status === 'In Progress',
      'done-column': status === 'Done',
    };
  }

  statusHeaderClass(status: string) {
    return {
      'todo-header': status === 'To Do',
      'inprogress-header': status === 'In Progress',
      'done-header': status === 'Done',
    };
  }
  trackByTaskId(index: number, task: Task): any {
    return task?.id ?? index;
  }
}
