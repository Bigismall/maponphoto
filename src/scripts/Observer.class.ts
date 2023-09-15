import { type Message } from './Message.type'

export default abstract class Observer {
  protected constructor () {}

  update (publication: Message) {
    console.log('Publication [Observer]', publication)
  }
}
