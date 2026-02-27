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
import { getTasks } from "./utils/todoist-utils";
import { createTaskListContainer, createMenuListContainer } from "./utils/container-utils";

enum Page {
  TASKS,
  MENU
}
export enum TaskFilter {
  TODAY,
  ALL
}

let currentPage: Page = Page.TASKS;
let currentFilter: TaskFilter = TaskFilter.TODAY;

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
        case OsEventTypeList.DOUBLE_CLICK_EVENT: await bridge.shutDownPageContainer(0);
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
          currentPage = Page.MENU;
          await bridge.rebuildPageContainer(new RebuildPageContainer({
            listObject: [...createMenuListContainer(true), ...createTaskListContainer(tasks, false)],
            textObject: [],
            imageObject: [],
          }));
      }
    }
  });
}

await init();
