import { log } from "../../scripts/console.ts";
import type { Message } from "./Message.type.ts";

export type Listener = (message: Message) => void;

export class Publisher {
  protected subscribers: Listener[] = [];

  public constructor() {
    this.subscribers = [];
  }

  subscribe(observer: Listener) {
    this.subscribers.push(observer);

    // Return closure to unsubscribe
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== observer);
    };
  }

  publish(publication: Message) {
    log("Publishing message:", publication);
    this.subscribers.map((listener) => {
      listener(publication);
      return listener;
    });
  }
}
