import { type Message } from './Message.type'
import type Publisher from './Publisher.class'

const ObserverPublisher = (superclass: typeof Publisher) =>
  class extends superclass {
    update (publication: Message) {
      console.log('Publication: ', publication)
    }
  }

export default ObserverPublisher
