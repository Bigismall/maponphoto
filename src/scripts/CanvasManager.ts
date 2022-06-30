import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";
import { MapPosition } from "./MapManager";

// 4/3
const MAX_WIDTH = 1280;
const MAX_HEIGHT = 960;
const MIN_WIDTH = 640;
const MIN_HEIGHT = 480;

export default class CanvasManager extends ObserverPublisher(Publisher) {
  private readonly selector: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  constructor($selector: HTMLCanvasElement) {
    super();
    this.selector = $selector;
    this.context = this.selector.getContext("2d");
    console.log("Canvas", this.width, this.height, this.aspectRatio);
  }

  get height(): number {
    return this.selector.height;
  }

  get width(): number {
    return this.selector.width;
  }

  get aspectRatio(): number {
    return this.width / this.height;
  }

  protected clear() {
    this.context?.clearRect(0, 0, this.width, this.height);
  }

  protected resizeFor(width: number, height: number) {
    const ratio = width / height;
    let newWidth = 0;
    let newHeight = 0;

    if (ratio > 1) {
      newWidth = Math.min(MAX_WIDTH, width);
      newHeight = newWidth / ratio;
    } else {
      newHeight = Math.min(MAX_HEIGHT, height);
      newWidth = newHeight * ratio;
    }

    console.log("Resize", newWidth, newHeight, newWidth / newHeight);
    this.selector.width = newWidth;
    this.selector.height = newHeight;
    console.log("Canvas", this.width, this.height, this.aspectRatio);
  }

  protected draw(image: CanvasImageSource) {
    const { width, height } = image as HTMLImageElement;
    this.resizeFor(width, height);

    this.context?.drawImage(image, 0, 0, this.width, this.height);
  }

  protected drawMap(image: HTMLImageElement, position: MapPosition) {
    let x = 0;
    let y = 0;

    //Fixme - extract this
    switch (position) {
      case MapPosition.TOP_LEFT:
        x = 0;
        y = 0;
        break;
      case MapPosition.TOP_RIGHT:
        x = this.width - image.width;
        y = 0;
        break;
      case MapPosition.BOTTOM_LEFT:
        x = 0;
        y = this.height - image.height;
        break;
      case MapPosition.BOTTOM_RIGHT:
        x = this.width - image.width;
        y = this.height - image.height;
        break;
      case MapPosition.CENTER:
        x = (this.width - image.width) / 2;
        y = (this.height - image.height) / 2;
        break;
    }

    this.context?.drawImage(image, x, y);
  }

  update(publication: Message) {
    if (publication.state === MessageState.Reset) {
      this.clear();
    }

    if (publication.state === MessageState.FileReady) {
      this.clear();
      this.draw(publication.data as CanvasImageSource);
    }

    if (publication.state === MessageState.MapImageReady) {
      this.drawMap(
        // @ts-ignore
        publication.data.image as HTMLImageElement,
        // @ts-ignore
        publication.data.position
      );
      this.publish({
        state: MessageState.CanvasWithMapReady,
        data: this.selector,
      });
    }
  }
}
