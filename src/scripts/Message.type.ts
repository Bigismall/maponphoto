export enum MessageState {
    Ready = "Ready",
    Show = "Show",
    Hide = "Hide",
    Reset = "Reset",
    FileChange = "FileChange",
    FileReady = "FileReady",
    ExifReady = "ExifReady",
    ExifMissing = "ExifMissing",
    MapImageReady = "MapImageReady",
    MapSetupReady = "MapSetupReady",
    ResizeMap = "ResizeMap",
    CanvasWithMapReady = "CanvasWithMapReady",
    FileError = "FileError",
    MoveMap = "MoveMap"
}

export type Message = {
    state: MessageState;
    data: unknown;
};
