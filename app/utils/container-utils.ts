import { GetTasksResponse, Task } from "@doist/todoist-api-typescript";
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
      width: 460,
      height: 268,
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

export function createTaskDetailsContainer(task: Task): {
  listObject: ListContainerProperty[];
  textObject: TextContainerProperty[];
} {
  const dueDate = task.due?.date ?? "N/A";
  const doDate = (task as any).deadline?.date ?? "N/A";

  const actionsContainer = new ListContainerProperty({
    xPosition: 10,
    yPosition: 10,
    width: 130,
    height: 248,
    containerID: 1,
    containerName: "task-actions-list",
    paddingLength: 5,
    borderRdaius: 5,
    borderWidth: 1,
    borderColor: 5,
    itemContainer: new ListItemContainerProperty({
      itemCount: 3,
      itemWidth: 0,
      isItemSelectBorderEn: 1,
      itemName: ["Complete", "Tomorrow", "Inbox"],
    }),
    isEventCapture: 1,
  });

  const content = [
    `★ ${task.content}`,
    ``,
    `→ Deadline: ${doDate}`,
    `→ Due: ${dueDate}`,
    ``,
    `● ${task.description || "No description"}`,
  ].join("\n");

  const detailsText = new TextContainerProperty({
    xPosition: 150,
    yPosition: 10,
    width: 300,
    height: 248,
    containerID: 2,
    containerName: "task-details",
    paddingLength: 5,
    content,
  });

  return {
    listObject: [actionsContainer],
    textObject: [detailsText],
  };
}

export function createMenuListContainer(
  focused: boolean
): ListContainerProperty[] {
  return [
    new ListContainerProperty({
      xPosition: 10,
      yPosition: 10,
      width: 100,
      height: 268,
      containerID: 2,
      containerName: "menu-list",
      paddingLength: 5,
      borderRdaius: 5,
      borderWidth: 1,
      borderColor: 5,
      itemContainer: new ListItemContainerProperty({
        itemCount: 2,
        itemWidth: 0,
        isItemSelectBorderEn: 1,
        itemName: ["All", "Today"],
      }),
      isEventCapture: focused ? 1 : 0,
    }),
  ];
}
