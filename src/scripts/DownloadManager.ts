import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class DownloadManager extends ObserverPublisher(Publisher) {
  private downloadSelector: HTMLLinkElement;
  private resetSelector: HTMLButtonElement;
  private container: HTMLElement | null;
  constructor(
    $downloadElement: HTMLLinkElement,
    $resetElement: HTMLButtonElement
  ) {
    super();
    this.downloadSelector = $downloadElement;
    this.resetSelector = $resetElement;
    this.container = $downloadElement.parentElement;

    this.resetSelector.addEventListener("click", (e: Event) => {
      this.hide();
      this.publish({ state: MessageState.Reset, data: null });
    });
  }

  update(publication: Message) {
    if (publication.state === MessageState.CanvasWithMapReady) {
      this.show();
      this.prepareDownload();
    }
  }

  generateFilename() {
    const today = new Date();
    return `mtp-${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}.jpg`;
  }

  prepareDownload() {
    const $canvas = document.getElementById(
      "js-main-canvas"
    ) as HTMLCanvasElement;

    if (!$canvas) {
      console.warn("Canvas not found");
      return;
    }

    const dataURL = $canvas.toDataURL("image/jpeg", 0.8);
    this.downloadSelector.setAttribute("download", this.generateFilename());
    this.downloadSelector.setAttribute("href", dataURL);
  }

  hide() {
    this.container?.classList.add("download--hidden");
  }

  show() {
    this.container?.classList.remove("download--hidden");
  }
}
