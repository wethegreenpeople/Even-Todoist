import { GetTasksResponse } from "@doist/todoist-api-typescript";
import {
  ListContainerProperty,
  ListItemContainerProperty,
  TextContainerProperty,
} from "@evenrealities/even_hub_sdk";

export function createTaskListContainer(
  tasks: GetTasksResponse,
  onTaskList: boolean
): ListContainerProperty[] {
  const taskList = tasks.results.map((result) => result.content);
  return [
    new ListContainerProperty({
      xPosition: 0,
      yPosition: 0,
      width: 560,
      height: 200,
      containerID: 1,
      containerName: "tasks-list",
      paddingLength: 5,
      itemContainer: new ListItemContainerProperty({
        itemCount: taskList.length,
        itemWidth: 0,
        isItemSelectBorderEn: 1,
        itemName: tasks.results.map((result, index) => result.content),
      }),
      isEventCapture: onTaskList ? 1 : 0,
    }),
  ];
}

export function createTaskMenuContainer(selectedItemIndex: number | null): TextContainerProperty[] {
  return [
    new TextContainerProperty({
      xPosition: 237,
      yPosition: 0,
      borderWidth: selectedItemIndex === 0 ? 1 : 0,
      borderColor: 5,
      paddingLength: 10,
      width: 75,
      height: 50,
      containerID: 2,
      containerName: "today-label",
      content: "Today",
      isEventCapture: selectedItemIndex === 0 ? 1 : 0,
    }),
    new TextContainerProperty({
      xPosition: 326,
      yPosition: 0,
      borderWidth: selectedItemIndex === 1 ? 1 : 0,
      borderColor: 5,
      paddingLength: 10,
      width: 75,
      height: 50,
      containerID: 3,
      containerName: "all-label",
      content: "All",
      isEventCapture: selectedItemIndex === 1 ? 1 : 0,
    }),
  ];
}
