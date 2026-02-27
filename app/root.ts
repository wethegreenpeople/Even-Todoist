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
import { getTodaysTasks } from "./utils/todoist-utils";
import { createTaskListContainer, createMenuListContainer } from "./utils/container-utils";

enum Page {
  TASKS,
  MENU
}

let currentPage: Page = Page.TASKS;

async function init() {
  const tasks = await getTodaysTasks(5);

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
          console.log("click")
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
