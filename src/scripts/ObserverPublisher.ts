import { log } from "./console.ts";
import type { Message } from "./Message.type";
import type Publisher from "./Publisher.class";

const ObserverPublisher = (superclass: typeof Publisher) =>
  class extends superclass {
    update(publication: Message) {
      log("Publication: ", publication);
    }
  };

export default ObserverPublisher;
