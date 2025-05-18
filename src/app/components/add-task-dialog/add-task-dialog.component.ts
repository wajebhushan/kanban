import { Component, inject } from '@angular/core';
import { DialogRef, DialogModule } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css',
})
export class AddTaskDialogComponent {
  dialogRef = inject(DialogRef);
  title = '';
  description = '';
  status = 'To Do';

  submit() {
    this.dialogRef.close({
      title: this.title,
      description: this.description,
      status: this.status,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
