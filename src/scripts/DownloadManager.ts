import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class DownloadManager extends ObserverPublisher(Publisher) {
  private downloadSelector: HTMLLinkElement;
  private resetSelector: HTMLButtonElement;

  constructor(
    $downloadDelector: HTMLLinkElement,
    $resetElement: HTMLButtonElement
  ) {
    super();
    this.downloadSelector = $downloadDelector;
    this.resetSelector = $resetElement;
    this.prepareDownload();
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

    console.log("preparing download");
    const dataURL = $canvas.toDataURL("image/jpeg", 0.8);
    this.downloadSelector.setAttribute("download", this.generateFilename());
    this.downloadSelector.setAttribute("href", dataURL);
  }
}
