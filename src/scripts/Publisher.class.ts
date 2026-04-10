import { log } from "./console.ts";
import type { Message } from "./Message.type";
import type Observer from "./Observer.class";

export default abstract class Publisher {
  protected subscribers: Observer[] = [];

  protected constructor() {
    this.subscribers = [];
  }

  subscribe(callback: Observer) {
    this.subscribers.push(callback);
  }

  publish(publication: Message) {
    log("Publishing message:", publication);
    this.subscribers.map((s) => {
      s.update(publication);
      return s;
    });
  }
}
