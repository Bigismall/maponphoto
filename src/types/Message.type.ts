import type { MapPosition } from "@scripts/MapManager.ts";

export enum MessageState {
  CanvasWithMapReady = "CanvasWithMapReady",
  ExifMissing = "ExifMissing",
  ExifReady = "ExifReady",
  FileChange = "FileChange",
  FileError = "FileError",
  FileReady = "FileReady",
  Hide = "Hide",
  MapImageReady = "MapImageReady",
  MapSetupReady = "MapSetupReady",
  MoveMap = "MoveMap",
  Reset = "Reset",
  ResizeMap = "ResizeMap",
  NextImage = "NextImage",
}

export type Message =
  | {
      state: MessageState.CanvasWithMapReady;
      data: Blob;
    }
  | {
      state: MessageState.ExifMissing;
      data?: never;
    }
  | {
      state: MessageState.ExifReady;
      data: {
        lat: number;
        lng: number;
        dir: number;
      };
    }
  | {
      state: MessageState.FileChange;
      data: Event;
    }
  | {
      state: MessageState.FileError;
      data: string;
    }
  | {
      state: MessageState.FileReady;
      data: CanvasImageSource;
    }
  | {
      state: MessageState.Hide;
      data?: never;
    }
  | {
      state: MessageState.MapImageReady;
      data: {
        image: HTMLImageElement;
        position: MapPosition;
      };
    }
  | {
      state: MessageState.MapSetupReady;
      data?: never;
    }
  | {
      state: MessageState.MoveMap;
      data: MapPosition;
    }
  | {
      state: MessageState.Reset;
      data?: never;
    }
  | {
      state: MessageState.ResizeMap;
      data: string;
    }
  | {
      state: MessageState.NextImage;
      data?: never;
    };
export type MessageListener = (message: Message) => void;
