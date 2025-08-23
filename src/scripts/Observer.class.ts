import { log } from "./console.ts";
import type { Message } from "./Message.type";

export default abstract class Observer {
  protected constructor() {}

  update(publication: Message) {
    log("Publication [Observer]", publication);
  }
}
