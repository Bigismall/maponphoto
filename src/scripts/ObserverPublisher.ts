import type { Message } from "../lib/MessageBroker/Message.type.ts";
import type { Publisher } from "../lib/MessageBroker/Publisher.class.ts";
import { log } from "./console.ts";

const ObserverPublisher = (superclass: typeof Publisher) =>
  class extends superclass {
    update(publication: Message) {
      log("Publication: ", publication);
    }
  };

export default ObserverPublisher;
