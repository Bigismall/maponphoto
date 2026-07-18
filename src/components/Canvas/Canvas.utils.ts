import { MapPosition } from "@app-types/Map.type.ts";
import type { Point } from "@app-types/Point.type.ts";
import { log } from "@utils/console.ts";
import { DOMAIN_LABEL } from "@utils/constans.ts";

export interface CanvasSize {
  width: number;
  height: number;
}

export type ExportCanvas = OffscreenCanvas | HTMLCanvasElement;

export interface ExportTarget {
  canvas: ExportCanvas;
  context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;
}

type DrawContext =
  | OffscreenCanvasRenderingContext2D
  | CanvasRenderingContext2D
  | null;

const UI_MAX_WIDTH = 1600;
const UI_MAX_HEIGHT = 1200;
const EXPORT_MAX_WIDTH = 2560;
const EXPORT_MAX_HEIGHT = 1920;

export const createExportTarget = (): ExportTarget => {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext("2d");

    if (context) {
      return {
        canvas,
        context,
      };
    }

    log(
      "Canvas",
      "OffscreenCanvas 2D context is unavailable, falling back to HTMLCanvasElement for export.",
    );
  }

  // Fallback keeps feature working when OffscreenCanvas is not available.
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    log(
      "Canvas",
      "HTMLCanvasElement 2D context is unavailable, export will be disabled.",
    );
  }

  return {
    canvas,
    context,
  };
};

export const getUiSizeFor = (width: number, height: number): CanvasSize => {
  const ratio = width / height;

  if (ratio > 1) {
    const newWidth = Math.min(UI_MAX_WIDTH, width);
    return {
      width: Math.max(1, Math.round(newWidth)),
      height: Math.max(1, Math.round(newWidth / ratio)),
    };
  }

  const newHeight = Math.min(UI_MAX_HEIGHT, height);
  return {
    width: Math.max(1, Math.round(newHeight * ratio)),
    height: Math.max(1, Math.round(newHeight)),
  };
};

export const setCanvasSize = (canvas: ExportCanvas, size: CanvasSize) => {
  canvas.width = size.width;
  canvas.height = size.height;
};

export const getExportSizeFor = (width: number, height: number): CanvasSize => {
  const scale = Math.min(
    1,
    EXPORT_MAX_WIDTH / width,
    EXPORT_MAX_HEIGHT / height,
  );

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

export const getSize = (canvas: ExportCanvas): CanvasSize => {
  return {
    width: canvas.width,
    height: canvas.height,
  };
};

export const getMapPosition = (
  position: MapPosition,
  canvasSize: CanvasSize,
  imageSize: CanvasSize,
): Point => {
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
};

export const drawOn = (
  context: DrawContext,
  image: CanvasImageSource,
  targetSize: CanvasSize,
) => {
  context?.drawImage(image, 0, 0, targetSize.width, targetSize.height);
};

export const drawMapOn = (
  context: DrawContext,
  canvasSize: CanvasSize,
  image: HTMLImageElement,
  position: MapPosition,
  scale: number,
): CanvasSize => {
  const targetImageSize = {
    width: image.width * scale,
    height: image.height * scale,
  };

  const { x, y } = getMapPosition(position, canvasSize, targetImageSize);

  context?.drawImage(
    image,
    x,
    y,
    targetImageSize.width,
    targetImageSize.height,
  );

  return targetImageSize;
};

export const drawLabelOn = (
  context: DrawContext,
  canvasSize: CanvasSize,
  imageSize: CanvasSize,
  position: MapPosition,
  scale: number,
) => {
  if (!context) {
    return;
  }

  const { x, y } = getMapPosition(position, canvasSize, imageSize);
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
};
