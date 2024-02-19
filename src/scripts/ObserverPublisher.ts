import { type Message } from './Message.type';
import type Publisher from './Publisher.class';
import { log } from './console.ts';

const ObserverPublisher = (superclass: typeof Publisher) =>
  class extends superclass {
    update (publication: Message) {
      log('Publication: ', publication);
    }
  };

export default ObserverPublisher;
