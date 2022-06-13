export enum MessageState {
  Ready = "Ready",
  Show = "Show",
  Hide = "Hide",
  FileChange = "FileChange",
  FileReady = "FileReady",
  ExifReady = "ExifReady",
  ExifMissing = "ExifMissing",
  MapImageReady = "MapImageReady",
}

export type Message = {
  state: MessageState;
  data: unknown;
};
