import {
  CreateStartUpPageContainer,
  ListContainerProperty,
  TextContainerProperty,
  ImageContainerProperty,
  ListItemContainerProperty,
  waitForEvenAppBridge,
  EvenAppBridge,
  RebuildPageContainer,
} from "@evenrealities/even_hub_sdk";
import { getTodaysTasks } from "./utils/todoist-utils";
import { createTaskListContainer } from "./utils/container-utils";

const textContainer1 = new TextContainerProperty({
  xPosition: 27,
  yPosition: 24,
  width: 193,
  height: 53,
  containerID: 1,
  containerName: "text-1",
  content: "\u25A0 Section Title",
  isEventCapture: 1
});
async function init() {
  const tasks = await getTodaysTasks();
  const taskListContainer = createTaskListContainer(tasks);

  const bridge = await waitForEvenAppBridge();
  const result = await bridge.createStartUpPageContainer(new CreateStartUpPageContainer({
    containerTotalNum: 1,
    listObject: [taskListContainer],
    textObject: [],
    imageObject: [],
  }));
  console.log("createStartUpPageContainer result:", result);



  const unsubscribe = bridge.onEvenHubEvent(async (event) => {
    if (event.listEvent) {
      const updatedTaskContainer = createTaskListContainer(tasks);
      await bridge.rebuildPageContainer(new RebuildPageContainer({
        listObject: [updatedTaskContainer],
        textObject: [],
        imageObject: [],
      }));
    }
  });
}

await init();
