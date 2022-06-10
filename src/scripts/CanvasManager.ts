import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class CanvasManager extends ObserverPublisher(Publisher) {
  private readonly selector: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  private readonly width: number;
  private readonly height: number;

  constructor($selector: HTMLCanvasElement) {
    super();
    this.selector = $selector;
    this.context = this.selector.getContext("2d");
    this.width = this.selector.width;
    this.height = this.selector.height;
  }

  protected clear() {
    this.context?.clearRect(0, 0, this.width, this.height);
  }

  protected draw(image: CanvasImageSource) {
    this.context?.drawImage(image, 0, 0);
  }

  update(publication: Message) {
    if (publication.state === MessageState.FileReady) {
      this.clear();
      this.draw(publication.data as CanvasImageSource);
    }
  }
}
