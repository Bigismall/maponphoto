import { Message } from "./Message.type";
import Publisher from "./Publisher.class";

const ObserverPublisher = (superclass: typeof Publisher) =>
  class extends superclass {
    constructor() {
      super();
    }

    update(publication: Message) {
      console.log(`Publication: ${publication}`);
    }
  };

export default ObserverPublisher;
