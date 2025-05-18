import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  task = input<any>(null);

  constructor() {
    effect(() => {
      const task = this.task();
      if (task) {
        console.log('task: ', task);
      }
    });
  }
}
