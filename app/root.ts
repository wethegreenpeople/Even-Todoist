import {
  CreateStartUpPageContainer,
  ListContainerProperty,
  TextContainerProperty,
  ImageContainerProperty,
  ListItemContainerProperty,
  waitForEvenAppBridge,
  EvenAppBridge,
  RebuildPageContainer,
  Sys_ItemEvent,
  OsEventTypeList,
} from "@evenrealities/even_hub_sdk";
import { getTasks, completeTask, rescheduleTask, moveToInbox } from "./utils/todoist-utils";
import { createTaskListContainer, createMenuListContainer, createTaskDetailsContainer } from "./utils/container-utils";
import { Task } from "@doist/todoist-api-typescript";

enum Page {
  TASKS,
  MENU,
  TASK_DETAILS
}
export enum TaskFilter {
  TODAY,
  ALL
}

let currentPage: Page = Page.TASKS;
let currentFilter: TaskFilter = TaskFilter.TODAY;
let selectedTask: Task | null = null;

async function init() {
  let tasks = await getTasks(5, currentFilter);

  const bridge = await waitForEvenAppBridge();
  const result = await bridge.createStartUpPageContainer(new CreateStartUpPageContainer({
    containerTotalNum: 2,
    listObject: [...createTaskListContainer(tasks, true)],
    textObject: [],
    imageObject: [],
  }));



  const unsubscribe = bridge.onEvenHubEvent(async (event) => {
    console.log(event);

    // Handle menu events
    if (currentPage === Page.MENU) {
      console.log("menu");
      switch (event.sysEvent?.eventType) {
        case OsEventTypeList.DOUBLE_CLICK_EVENT:
          await bridge.shutDownPageContainer(0);
        default: break;
      }
      switch (event.listEvent?.eventType) {
        case OsEventTypeList.CLICK_EVENT:
        case undefined:
          console.log(`Click: ${event.listEvent?.currentSelectItemIndex} (${event.listEvent?.currentSelectItemName})`);
          if (event.listEvent?.currentSelectItemIndex === undefined || event.listEvent?.currentSelectItemIndex === 0) {
            currentFilter = TaskFilter.ALL;
            currentPage = Page.TASKS;
            tasks = await getTasks(10, currentFilter);
            await bridge.rebuildPageContainer(new RebuildPageContainer({
              listObject: [...createTaskListContainer(tasks, true)],
              textObject: [],
              imageObject: [],
            }));
          }
          else if (event.listEvent?.currentSelectItemIndex === 1) {
            currentFilter = TaskFilter.TODAY;
            currentPage = Page.TASKS;
            tasks = await getTasks(5, currentFilter);
            await bridge.rebuildPageContainer(new RebuildPageContainer({
              listObject: [...createTaskListContainer(tasks, true)],
              textObject: [],
              imageObject: [],
            }));
          }
          break;
        default: break;
      }
    }
    else if (currentPage === Page.TASKS) {
      switch (event.sysEvent?.eventType) {
        case OsEventTypeList.DOUBLE_CLICK_EVENT:
          console.log("doot");
          currentPage = Page.MENU;
          selectedTask = null;
          await bridge.rebuildPageContainer(new RebuildPageContainer({
            listObject: [...createMenuListContainer(true), ...createTaskListContainer(tasks, false)],
            textObject: [],
            imageObject: [],
          }));
          break;
        default: break;
      }
      if (currentPage === Page.TASKS) {
        switch (event.listEvent?.eventType) {
          case OsEventTypeList.CLICK_EVENT:
          // Sometimes, at least in the simulator, the event type comes through as undefined
          // So we have to handle it
          case undefined:
            currentPage = Page.TASK_DETAILS;
            // Sometimes (again at least in the sim, the index comes as undefined, we'll always assume it's the first item)
            const index = event.listEvent?.currentSelectItemIndex ?? 0;
            if (tasks.results[index]) {
              selectedTask = tasks.results[index];
              const { listObject, textObject } = createTaskDetailsContainer(selectedTask);
              await bridge.rebuildPageContainer(new RebuildPageContainer({
                listObject,
                textObject,
                imageObject: [],
              }));
            }
            break;
          default: break;
        }
      }
    }
    else if (currentPage === Page.TASK_DETAILS) {
      switch (event.sysEvent?.eventType) {
        case OsEventTypeList.DOUBLE_CLICK_EVENT:
          currentPage = Page.TASKS;
          selectedTask = null;
          tasks = await getTasks(5, currentFilter);
          await bridge.rebuildPageContainer(new RebuildPageContainer({
            listObject: [...createTaskListContainer(tasks, true)],
            textObject: [],
            imageObject: [],
          }));
          break;
        default: break;
      }
      switch (event.listEvent?.eventType) {
        case OsEventTypeList.CLICK_EVENT:
        case undefined:
          const menuSelection = event.listEvent?.currentSelectItemIndex ?? 0
          if (selectedTask && menuSelection === 0) {
            await completeTask(selectedTask.id);
            currentPage = Page.TASKS;
            tasks = await getTasks(5, currentFilter);
            await bridge.rebuildPageContainer(new RebuildPageContainer({
              listObject: [...createTaskListContainer(tasks, true)],
              textObject: [],
              imageObject: [],
            }));
          } else if (selectedTask && menuSelection === 1) {
            await rescheduleTask(selectedTask.id);
            currentPage = Page.TASKS;
            tasks = await getTasks(5, currentFilter);
            await bridge.rebuildPageContainer(new RebuildPageContainer({
              listObject: [...createTaskListContainer(tasks, true)],
              textObject: [],
              imageObject: [],
            }));
          } else if (selectedTask && menuSelection === 2) {
            await moveToInbox(selectedTask.id);
            currentPage = Page.TASKS;
            tasks = await getTasks(5, currentFilter);
            await bridge.rebuildPageContainer(new RebuildPageContainer({
              listObject: [...createTaskListContainer(tasks, true)],
              textObject: [],
              imageObject: [],
            }));
          }
          break;
        default: break;
      }
    }
  });
}

await init();
