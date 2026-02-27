import { GetTasksResponse, TodoistApi } from '@doist/todoist-api-typescript'
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
