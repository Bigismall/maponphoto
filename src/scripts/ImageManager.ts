import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class ImageManager extends ObserverPublisher(Publisher) {
  private image: HTMLImageElement;

  // constructor(e?: Event) {
  //   super();
  // }

  update(publication: Message) {
    if (publication.state === MessageState.FileChange) {
      const event = publication.data as Event;
      const reader = new FileReader();

      if (!event) {
        return;
      }
      const file = event?.target?.files?.[0] ?? null;

      if (!file) {
        return;
      }

      this.image = document.createElement("img");
      this.image.file = file;

      this.image.onload = () => {
        this.publish({ state: MessageState.FileReady, data: this.image });
      };

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.image.src = e?.target?.result ?? "";
      };

      reader.onerror = (e) => {
        console.error(e);
      };

      reader.readAsDataURL(file);
    }

    console.log("ImageManager", publication.state, publication.data);
  }
}
