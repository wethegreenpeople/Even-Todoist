import { GetTasksResponse, TodoistApi } from '@doist/todoist-api-typescript'

export async function getTodaysTasks(limit: number): Promise<GetTasksResponse> {
  const api = new TodoistApi(import.meta.env.VITE_TODOIST_API_KEY);
  const tasks = await api.getTasksByFilter({query: "today | overdue", limit});
  return tasks;
}
