import { GetTasksResponse } from "@doist/todoist-api-typescript";
import { ListContainerProperty, ListItemContainerProperty } from "@evenrealities/even_hub_sdk";

export function createTaskListContainer(tasks: GetTasksResponse): ListContainerProperty {
  const taskList = tasks.results.map(result => result.content);
  return new ListContainerProperty({
    xPosition: 0,
    yPosition: 0,
    width: 560,
    height: 288,
    containerID: 1,
    containerName: "tasks-list",
    paddingLength: 5,
    itemContainer: new ListItemContainerProperty({
      itemCount: taskList.length,
      itemWidth: 0,
      isItemSelectBorderEn: 1,
      itemName: tasks.results.map((result, index) => result.content),
    }),
    isEventCapture: 1,
  });
}
