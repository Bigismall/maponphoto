import { log } from "../../scripts/console.ts";
import type { Message } from "./Message.type.ts";

export abstract class Observer {
  update(publication: Message) {
    log("Publication [Observer]", publication);
  }
}


