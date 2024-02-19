import type Observer from './Observer.class';
import { type Message } from './Message.type';

export default abstract class Publisher {
  protected subscribers: Observer[] = [];

  protected constructor () {
    this.subscribers = [];
  }

  subscribe (callback: Observer) {
    this.subscribers.push(callback);
  }

  publish (publication: Message) {
    this.subscribers.map((s) => { s.update(publication); return s; });
  }
}
