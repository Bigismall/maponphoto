import type { MapPosition } from "@app-types/Map.type.ts";
import {
  type Message,
  type MessageListener,
  MessageState,
} from "@app-types/Message.type.ts";
import {
  createExportTarget,
  drawLabelOn,
  drawMapOn,
  drawOn,
  type ExportTarget,
  getExportSizeFor,
  getSize,
  getUiSizeFor,
  setCanvasSize,
} from "@components/Canvas/Canvas.utils.ts";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";
import { log } from "@utils/console.ts";
import { useCallback, useEffect, useRef } from "react";

const UI_MAX_WIDTH = 1600;
const UI_MAX_HEIGHT = 1200;
const DEFAULT_EXPORT_WIDTH = UI_MAX_WIDTH;
const DEFAULT_EXPORT_HEIGHT = UI_MAX_HEIGHT;

export const Canvas = () => {
  const { notify, registerListener } = useMessageBroker();
  const exportGenerationRef = useRef<number>(0);
  const uiCanvas = useRef<HTMLCanvasElement | null>(null);
  const exportTargetRef = useRef<ExportTarget | null>(null);

  if (exportTargetRef.current == null) {
    exportTargetRef.current = createExportTarget();
  }

  const exportTarget = exportTargetRef.current;

  const exportAsBlob = useCallback(async (): Promise<Blob | null> => {
    if (!exportTarget.context) {
      return null;
    }

    if (
      typeof OffscreenCanvas !== "undefined" &&
      exportTarget.canvas instanceof OffscreenCanvas
    ) {
      return exportTarget.canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.95,
      });
    }

    const htmlCanvas = exportTarget.canvas as HTMLCanvasElement;

    return new Promise((resolve) => {
      htmlCanvas.toBlob(
        (blob: Blob | null) => resolve(blob),
        "image/jpeg",
        0.95,
      );
    });
  }, [exportTarget.canvas, exportTarget.context]);

  const draw = useCallback(
    (image: HTMLImageElement) => {
      const { width, height } = image as HTMLImageElement;
      const uiSize = getUiSizeFor(width, height);
      const exportSize = getExportSizeFor(width, height);
      const uiCanvasElement = uiCanvas.current;

      if (!uiCanvasElement) {
        return;
      }

      setCanvasSize(uiCanvasElement, uiSize);
      setCanvasSize(exportTarget.canvas, exportSize);

      drawOn(uiCanvasElement.getContext("2d"), image, uiSize);
      drawOn(exportTarget.context, image, exportSize);
    },
    [exportTarget.canvas, exportTarget.context],
  );

  const drawMap = useCallback(
    (image: HTMLImageElement, position: MapPosition) => {
      const uiCanvasElement = uiCanvas.current;

      if (!uiCanvasElement) {
        return;
      }

      const uiContext = uiCanvasElement.getContext("2d");
      const uiSize = getSize(uiCanvasElement);
      const exportSize = getSize(exportTarget.canvas);
      const mapScale = exportSize.width / uiSize.width;

      const uiMapSize = drawMapOn(uiContext, uiSize, image, position, 1);
      const exportMapSize = drawMapOn(
        exportTarget.context,
        exportSize,
        image,
        position,
        mapScale,
      );

      drawLabelOn(uiContext, uiSize, uiMapSize, position, 1);
      drawLabelOn(
        exportTarget.context,
        exportSize,
        exportMapSize,
        position,
        mapScale,
      );
    },
    [exportTarget.canvas, exportTarget.context],
  );

  const clear = useCallback(() => {
    const uiCanvasElement = uiCanvas.current;

    if (uiCanvasElement) {
      const uiContext = uiCanvasElement.getContext("2d");
      uiContext?.clearRect(0, 0, uiCanvasElement.width, uiCanvasElement.height);
    }

    const exportSize = getSize(exportTarget.canvas);
    exportTarget.context?.clearRect(0, 0, exportSize.width, exportSize.height);
  }, [exportTarget.canvas, exportTarget.context]);

  const nextExportGeneration = useCallback((): number => {
    const nextGeneration = exportGenerationRef.current + 1;
    exportGenerationRef.current = nextGeneration;
    return nextGeneration;
  }, []);

  const resizeForUi = useCallback((width: number, height: number) => {
    const uiSize = getUiSizeFor(width, height);
    const uiCanvasElement = uiCanvas.current;

    if (!uiCanvasElement) {
      return;
    }

    setCanvasSize(uiCanvasElement, uiSize);
  }, []);

  const resizeForExport = useCallback(
    (width: number, height: number) => {
      const exportSize = getExportSizeFor(width, height);
      setCanvasSize(exportTarget.canvas, exportSize);
    },
    [exportTarget.canvas],
  );

  const publishExportCanvas = useCallback(
    async (generation: number) => {
      const blob = await exportAsBlob();

      if (!blob || generation !== exportGenerationRef.current) {
        return;
      }
      log("Canvas ready");
      notify({
        state: MessageState.CanvasWithMapReady,
        data: blob,
      });
    },
    [exportAsBlob, notify],
  );

  const listener = useCallback<MessageListener>(
    (message: Message) => {
      if (message.state === MessageState.Reset) {
        nextExportGeneration();
        resizeForUi(UI_MAX_WIDTH, UI_MAX_HEIGHT);
        resizeForExport(DEFAULT_EXPORT_WIDTH, DEFAULT_EXPORT_HEIGHT);
        clear();
      }

      if (message.state === MessageState.FileReady) {
        nextExportGeneration();
        clear();
        draw(message.data as HTMLImageElement);
      }

      if (message.state === MessageState.MapImageReady) {
        const generation = nextExportGeneration();
        drawMap(message.data.image, message.data.position);
        publishExportCanvas(generation);
      }
    },
    [
      clear,
      draw,
      drawMap,
      nextExportGeneration,
      publishExportCanvas,
      resizeForExport,
      resizeForUi,
    ],
  );

  useEffect(() => {
    return registerListener(listener, "Canvas");
  }, [registerListener, listener]);

  return (
    <canvas
      className="canvas"
      ref={uiCanvas}
      height={UI_MAX_HEIGHT}
      width={UI_MAX_WIDTH}
    />
  );
};
