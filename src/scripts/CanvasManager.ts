import { MapPosition } from "./MapManager";
import { type Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";
import { log } from "./console.ts";
import { DOMAIN_LABEL } from "./constans.ts";

// 16/9
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;

export interface Point {
  x: number;
  y: number;
}

export default class CanvasManager extends ObserverPublisher(Publisher) {
  private readonly selector: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;

  constructor($selector: HTMLCanvasElement) {
    super();
    this.selector = $selector;
    this.context = this.selector.getContext("2d");
    log("Canvas", this.width, this.height, this.aspectRatio);
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

    this.selector.width = newWidth;
    this.selector.height = newHeight;
    log("Resized Canvas", this.width, this.height, this.aspectRatio);
  }

  protected draw(image: CanvasImageSource) {
    const { width, height } = image as HTMLImageElement;
    this.resizeFor(width, height);

    this.context?.drawImage(image, 0, 0, this.width, this.height);
  }

  protected getMapPosition(
    position: MapPosition,
    image: HTMLImageElement,
  ): Point {
    switch (position) {
      case MapPosition.TOP_LEFT:
        return { x: 0, y: 0 };
      case MapPosition.TOP_RIGHT:
        return { x: this.width - image.width, y: 0 };
      case MapPosition.BOTTOM_LEFT:
        return { x: 0, y: this.height - image.height };
      case MapPosition.BOTTOM_RIGHT:
        return { x: this.width - image.width, y: this.height - image.height };
      case MapPosition.CENTER:
        return {
          x: (this.width - image.width) / 2,
          y: (this.height - image.height) / 2,
        };
    }
  }

  protected drawMap(image: HTMLImageElement, position: MapPosition) {
    const { x, y } = this.getMapPosition(position, image);

    this.context?.drawImage(image, x, y);
  }

  protected drawLabel(
    label: string,
    image: HTMLImageElement,
    position: MapPosition,
  ) {
    const { x, y } = this.getMapPosition(position, image);
    const fontSize = 16;
    const font = `${fontSize}px sans-serif`;
    const barHeight = fontSize * 2;
    const bawWidth = image.width;

    const labelX = x;
    const labelY = y + image.height - barHeight;
    const padding = fontSize / 2;

    if (!this.context) {
      return;
    }

    this.context.fillStyle = "#2c3e50";
    this.context.fillRect(labelX, labelY, bawWidth, barHeight);
    this.context.fillStyle = "white";
    this.context.font = font;
    this.context.fillText(label, labelX + padding, labelY + fontSize * 1.25);
  }

  update(publication: Message) {
    if (publication.state === MessageState.Reset) {
      this.resizeFor(MAX_WIDTH, MAX_HEIGHT);
      this.clear();
    }

    if (publication.state === MessageState.FileReady) {
      this.clear();
      this.draw(publication.data);
    }

    if (publication.state === MessageState.MapImageReady) {
      this.drawMap(publication.data.image, publication.data.position);
      this.drawLabel(
        DOMAIN_LABEL,
        publication.data.image,
        publication.data.position,
      );

      this.publish({
        state: MessageState.CanvasWithMapReady,
        data: this.selector,
      });
    }
  }
}
