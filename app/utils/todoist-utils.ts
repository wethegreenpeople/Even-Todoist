import { GetTasksResponse, TodoistApi } from '@doist/todoist-api-typescript'

export async function getTodaysTasks(): Promise<GetTasksResponse> {
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_KEY);
  const tasks = await api.getTasks({limit: 5});
  return tasks;
}
