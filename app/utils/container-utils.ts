import { GetTasksResponse } from "@doist/todoist-api-typescript";
import {
  ListContainerProperty,
  ListItemContainerProperty,
  TextContainerProperty,
} from "@evenrealities/even_hub_sdk";

export function createTaskListContainer(
  tasks: GetTasksResponse,
  focused: boolean
): ListContainerProperty[] {
  const taskList = tasks.results.map((result) => result.content);
  return [
    new ListContainerProperty({
      xPosition: focused ? 0 : 100,
      yPosition: 0,
      width: 560,
      height: 200,
      containerID: 1,
      containerName: "tasks-list",
      paddingLength: 5,
      itemContainer: new ListItemContainerProperty({
        itemCount: taskList.length,
        itemWidth: 0,
        isItemSelectBorderEn: focused ? 1 : 0,
        itemName: tasks.results.map((result, index) => result.content),
      }),
      isEventCapture: focused ? 1 : 0,
    }),
  ];
}

export function createMenuListContainer(
  focused: boolean
): ListContainerProperty[] {
  return [
    new ListContainerProperty({
      xPosition: 0,
      yPosition: 0,
      width: 560,
      height: 200,
      containerID: 2,
      containerName: "menu-list",
      paddingLength: 5,
      itemContainer: new ListItemContainerProperty({
        itemCount: 2,
        itemWidth: 0,
        isItemSelectBorderEn: focused ? 1 : 0,
        itemName: ["All", "Today"],
      }),
      isEventCapture: focused ? 1 : 0,
    }),
  ];
}
