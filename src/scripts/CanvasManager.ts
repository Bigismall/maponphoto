import { log } from "./console.ts";
import { DOMAIN_LABEL } from "./constans.ts";
import { MapPosition } from "./MapManager";
import { type Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

// 16/9
const UI_MAX_WIDTH = 1600;
const UI_MAX_HEIGHT = 1200;
const EXPORT_MAX_WIDTH = 2560;
const EXPORT_MAX_HEIGHT = 1920;

export interface Point {
  x: number;
  y: number;
}

interface CanvasSize {
  width: number;
  height: number;
}

type ExportCanvas = OffscreenCanvas | HTMLCanvasElement;

interface ExportTarget {
  canvas: ExportCanvas;
  context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;
}

export default class CanvasManager extends ObserverPublisher(Publisher) {
  private readonly uiCanvas: HTMLCanvasElement;
  private readonly uiContext: CanvasRenderingContext2D | null;
  private readonly exportTarget: ExportTarget;

  constructor($selector: HTMLCanvasElement) {
    super();
    this.uiCanvas = $selector;
    this.uiContext = this.uiCanvas.getContext("2d");
    this.exportTarget = this.createExportTarget();
    log("Canvas", this.width, this.height, this.aspectRatio);
  }

  get height(): number {
    return this.uiCanvas.height;
  }

  get width(): number {
    return this.uiCanvas.width;
  }

  get aspectRatio(): number {
    return this.width / this.height;
  }

  private createExportTarget(): ExportTarget {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(1, 1);
      return {
        canvas,
        context: canvas.getContext("2d"),
      };
    }

    // Fallback keeps feature working when OffscreenCanvas is not available.
    const canvas = document.createElement("canvas");
    return {
      canvas,
      context: canvas.getContext("2d"),
    };
  }

  private setCanvasSize(
    canvas: ExportCanvas | HTMLCanvasElement,
    size: CanvasSize,
  ) {
    canvas.width = size.width;
    canvas.height = size.height;
  }

  private getUiSizeFor(width: number, height: number): CanvasSize {
    const ratio = width / height;

    if (ratio > 1) {
      const newWidth = Math.min(UI_MAX_WIDTH, width);
      return {
        width: newWidth,
        height: newWidth / ratio,
      };
    }

    const newHeight = Math.min(UI_MAX_HEIGHT, height);
    return {
      width: newHeight * ratio,
      height: newHeight,
    };
  }

  private getExportSizeFor(width: number, height: number): CanvasSize {
    const scale = Math.min(
      1,
      EXPORT_MAX_WIDTH / width,
      EXPORT_MAX_HEIGHT / height,
    );
    return {
      width: width * scale,
      height: height * scale,
    };
  }

  private getSize(canvas: ExportCanvas | HTMLCanvasElement): CanvasSize {
    return {
      width: canvas.width,
      height: canvas.height,
    };
  }

  private drawOn(
    context:
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null,
    image: CanvasImageSource,
    targetSize: CanvasSize,
  ) {
    context?.drawImage(image, 0, 0, targetSize.width, targetSize.height);
  }

  protected clear() {
    this.uiContext?.clearRect(0, 0, this.width, this.height);

    const exportSize = this.getSize(this.exportTarget.canvas);
    this.exportTarget.context?.clearRect(
      0,
      0,
      exportSize.width,
      exportSize.height,
    );
  }

  protected resizeForUi(width: number, height: number) {
    const uiSize = this.getUiSizeFor(width, height);
    this.setCanvasSize(this.uiCanvas, uiSize);
    log("Resized Canvas", this.width, this.height, this.aspectRatio);
  }

  protected draw(image: HTMLImageElement) {
    const { width, height } = image as HTMLImageElement;
    const uiSize = this.getUiSizeFor(width, height);
    const exportSize = this.getExportSizeFor(width, height);

    this.setCanvasSize(this.uiCanvas, uiSize);
    this.setCanvasSize(this.exportTarget.canvas, exportSize);

    this.drawOn(this.uiContext, image, uiSize);
    this.drawOn(this.exportTarget.context, image, exportSize);
  }

  private getMapPosition(
    position: MapPosition,
    canvasSize: CanvasSize,
    imageSize: CanvasSize,
  ): Point {
    switch (position) {
      case MapPosition.TOP_LEFT:
        return { x: 0, y: 0 };
      case MapPosition.TOP_RIGHT:
        return { x: canvasSize.width - imageSize.width, y: 0 };
      case MapPosition.BOTTOM_LEFT:
        return { x: 0, y: canvasSize.height - imageSize.height };
      case MapPosition.BOTTOM_RIGHT:
        return {
          x: canvasSize.width - imageSize.width,
          y: canvasSize.height - imageSize.height,
        };
      case MapPosition.CENTER:
        return {
          x: (canvasSize.width - imageSize.width) / 2,
          y: (canvasSize.height - imageSize.height) / 2,
        };
    }
  }

  private drawMapOn(
    context:
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null,
    canvasSize: CanvasSize,
    image: HTMLImageElement,
    position: MapPosition,
    scale: number,
  ): CanvasSize {
    const targetImageSize = {
      width: image.width * scale,
      height: image.height * scale,
    };

    const { x, y } = this.getMapPosition(position, canvasSize, targetImageSize);

    context?.drawImage(
      image,
      x,
      y,
      targetImageSize.width,
      targetImageSize.height,
    );

    return targetImageSize;
  }

  private drawLabelOn(
    context:
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null,
    canvasSize: CanvasSize,
    imageSize: CanvasSize,
    position: MapPosition,
    scale: number,
  ) {
    if (!context) {
      return;
    }

    const { x, y } = this.getMapPosition(position, canvasSize, imageSize);
    const fontSize = Math.max(16 * scale, 12);
    const font = `${fontSize}px sans-serif`;
    const barHeight = fontSize * 2;
    const barWidth = imageSize.width;

    const labelX = x;
    const labelY = y + imageSize.height - barHeight;
    const padding = fontSize / 2;

    context.fillStyle = "#2c3e50";
    context.fillRect(labelX, labelY, barWidth, barHeight);
    context.fillStyle = "white";
    context.font = font;
    context.fillText(DOMAIN_LABEL, labelX + padding, labelY + fontSize * 1.25);
  }

  private async exportAsBlob(): Promise<Blob | null> {
    if (this.exportTarget.canvas instanceof OffscreenCanvas) {
      return this.exportTarget.canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.95,
      });
    }

    const htmlCanvas = this.exportTarget.canvas as HTMLCanvasElement;

    return new Promise((resolve) => {
      htmlCanvas.toBlob(
        (blob: Blob | null) => resolve(blob),
        "image/jpeg",
        0.95,
      );
    });
  }

  private async publishExportCanvas() {
    const blob = await this.exportAsBlob();

    if (!blob) {
      return;
    }

    this.publish({
      state: MessageState.CanvasWithMapReady,
      data: blob,
    });
  }

  private drawMap(image: HTMLImageElement, position: MapPosition) {
    const uiSize = this.getSize(this.uiCanvas);
    const exportSize = this.getSize(this.exportTarget.canvas);
    const mapScale = exportSize.width / uiSize.width;

    const uiMapSize = this.drawMapOn(
      this.uiContext,
      uiSize,
      image,
      position,
      1,
    );
    const exportMapSize = this.drawMapOn(
      this.exportTarget.context,
      exportSize,
      image,
      position,
      mapScale,
    );

    this.drawLabelOn(this.uiContext, uiSize, uiMapSize, position, 1);
    this.drawLabelOn(
      this.exportTarget.context,
      exportSize,
      exportMapSize,
      position,
      mapScale,
    );
  }

  update(publication: Message) {
    if (publication.state === MessageState.Reset) {
      this.resizeForUi(UI_MAX_WIDTH, UI_MAX_HEIGHT);
      this.clear();
    }

    if (publication.state === MessageState.FileReady) {
      this.clear();
      this.draw(publication.data as HTMLImageElement);
    }

    if (publication.state === MessageState.MapImageReady) {
      this.drawMap(publication.data.image, publication.data.position);
      void this.publishExportCanvas();
    }
  }
}
