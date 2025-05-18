import { inject } from '@angular/core';
import { Task } from '../model/task.model';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, tap, catchError, switchMap, finalize } from 'rxjs';
import { TaskService } from '../service/task-service.service';

type TaskState = {
  taskList: any;
  isLoader: boolean;
};

const initialState: TaskState = {
  taskList: null,
  isLoader: false,
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, taskService = inject(TaskService)) => ({
    loadTasks: rxMethod<void>(() =>
      taskService.httpGetApi().pipe(
        tap((tasks) => {
          const statuses = ['To Do', 'In Progress', 'Done'];
          const grouped = statuses.map((status) => ({
            status,
            tasks: tasks.filter((t) => t.status === status),
          }));
          patchState(store, { taskList: grouped, isLoader: false });
        }),
        catchError((err) => {
          console.error(err);
          patchState(store, { taskList: [], isLoader: false });
          return of([]);
        })
      )
    ),

    addTask: rxMethod<Task>((task$) =>
      task$.pipe(
        tap(() => patchState(store, { isLoader: true })),

        switchMap((newTask) =>
          taskService.addTask(newTask).pipe(
            tap((saved) => {
              const current = store.taskList();
              const statusGroupIndex = current.findIndex(
                (g: any) => g.status === saved.status
              );
              let updatedList = [...current];
              if (statusGroupIndex !== -1) {
                const group = updatedList[statusGroupIndex];
                updatedList[statusGroupIndex] = {
                  ...group,
                  tasks: [...group.tasks, saved],
                };
              } else {
                updatedList.push({
                  status: saved.status,
                  tasks: [saved],
                });
              }

              patchState(store, {
                taskList: updatedList,
                isLoader: false,
              });
            }),

            catchError((err) => {
              patchState(store, { isLoader: false });
              return of(null);
            })
          )
        )
      )
    ),

    updateTaskOnServer: rxMethod<Task>((task$) =>
      task$.pipe(
        switchMap((updatedTask) =>
          taskService.updateTask(updatedTask).pipe(
            tap((serverTask) => {
              const current = store.taskList();
              const updatedGroups = current.map((group: any) => {
                const filtered = group.tasks.filter(
                  (t: any) => t.id !== serverTask.id
                );
                return {
                  ...group,
                  tasks:
                    group.status === serverTask.status
                      ? [...filtered, serverTask]
                      : filtered,
                };
              });

              patchState(store, { taskList: updatedGroups });
            }),
            catchError((err) => {
              console.error('Failed to update task:', err);
              return of(null);
            })
          )
        )
      )
    ),

    reorderTask(newList: Task[], status: string) {
      const updated = store
        .taskList()
        .map((group: any) =>
          group.status === status ? { ...group, tasks: newList } : group
        );
      patchState(store, { taskList: updated });
    },

    resetTasks() {
      patchState(store, initialState);
    },
  }))
);
