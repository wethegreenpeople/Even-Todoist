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
import { createTaskListContainer, createTaskMenuContainer } from "./utils/container-utils";

enum Page {
  TASKS,
  MENU
}

let currentPage: Page = Page.TASKS;

async function init() {
  const tasks = await getTodaysTasks(5);

  const bridge = await waitForEvenAppBridge();
  const result = await bridge.createStartUpPageContainer(new CreateStartUpPageContainer({
    containerTotalNum: 3,
    listObject: createTaskListContainer(tasks, true),
    textObject: createTaskMenuContainer(null),
    imageObject: [],
  }));



  const unsubscribe = bridge.onEvenHubEvent(async (event) => {
    console.log(event);
    if (event.sysEvent?.eventType === OsEventTypeList.DOUBLE_CLICK_EVENT) {
      currentPage = currentPage === Page.TASKS ? Page.MENU : Page.TASKS;
      await bridge.rebuildPageContainer(new RebuildPageContainer({
        listObject: createTaskListContainer(tasks, currentPage === Page.TASKS),
        textObject: createTaskMenuContainer(currentPage === Page.MENU ? 0 : null),
        imageObject: [],
      }));
    }
    else if (event.textEvent?.eventType === OsEventTypeList.SCROLL_BOTTOM_EVENT) {
      await bridge.rebuildPageContainer(new RebuildPageContainer({
        listObject: createTaskListContainer(tasks, false),
        textObject: createTaskMenuContainer(1),
        imageObject: [],
      }));
    }
    else if (event.textEvent?.eventType === OsEventTypeList.SCROLL_TOP_EVENT) {
      await bridge.rebuildPageContainer(new RebuildPageContainer({
        listObject: createTaskListContainer(tasks, false),
        textObject: createTaskMenuContainer(0),
        imageObject: [],
      }));
    }
  });
}

await init();
