import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class PhotoBrowser extends ObserverPublisher(Publisher) {
  private selector: HTMLInputElement;

  constructor($selector: HTMLInputElement) {
    super();
    this.selector = $selector;
    this.selector.addEventListener(
      "change",
      (e: Event) => this.publish({ state: MessageState.FileChange, data: e }),
      false
    );
  }

  update(publication: Message) {
    console.log(`PhotoBrowser: ${publication}`);
  }
}
