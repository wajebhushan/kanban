export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}
