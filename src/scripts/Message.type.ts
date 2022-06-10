export enum MessageState {
  Ready = "Ready",
  Show = "Show",
  Hide = "Hide",
  FileChange = "FileChange",
  FileReady = "FileReady",
}

export type Message = {
  state: MessageState;
  data: unknown;
};
