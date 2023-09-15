import type Observer from './Observer.class'
import { type Message } from './Message.type'

export default abstract class Publisher {
  protected subscribers: Observer[] = []

  protected constructor () {
    this.subscribers = []
  }

  subscribe (callback: Observer) {
    this.subscribers.push(callback)
  }

  // unsubscribe (callback: Observer) {
  //   this.subscribers = this.subscribers.filter((s) => s !== callback)
  // }

  publish (publication: Message) {
    this.subscribers.forEach((s) => { s.update(publication) })
  }
}
