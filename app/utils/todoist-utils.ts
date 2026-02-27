import { GetTasksResponse, Task, TodoistApi } from '@doist/todoist-api-typescript'
import { TaskFilter } from '../root';

export async function getTasks(limit: number, filter: TaskFilter): Promise<GetTasksResponse> {
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_KEY);
  let tasks: GetTasksResponse;
  switch (filter) {
    case TaskFilter.TODAY:
      tasks = await api.getTasksByFilter({query: "today | overdue", limit});
      break;
    case TaskFilter.ALL:
      tasks = await api.getTasks({limit});
      break;
  }
  return tasks;
}

export async function completeTask(taskId: string): Promise<boolean> {
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_KEY);
  return await api.closeTask(taskId);
}

export async function rescheduleTask(taskId: string): Promise<Task> {
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_KEY);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  return await api.updateTask(taskId, { dueDate: tomorrowStr });
}

export async function moveToInbox(taskId: string): Promise<Task> {
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_KEY);
  const projects = await api.getProjects();
  const inbox = projects.find((p) => p.isInboxProject);
  return await api.updateTask(taskId, { projectId: inbox!.id });
}
