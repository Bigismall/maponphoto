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
    CanvasWithMapReady = "CanvasWithMapReady",
    FileError = "FileError",
}

export type Message = {
    state: MessageState;
    data: unknown;
};
