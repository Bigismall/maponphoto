import type { MapPosition } from "./MapManager";

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
  // Ready = 'Ready',
  Reset = "Reset",
  ResizeMap = "ResizeMap",
  // Show = 'Show',
}

export type Message =
  | {
      state: MessageState.CanvasWithMapReady;
      data: HTMLCanvasElement;
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
    };
