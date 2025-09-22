import { warn } from "./console.ts";
import { type Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class DownloadManager extends ObserverPublisher(Publisher) {
  private readonly downloadSelector: HTMLLinkElement;
  private readonly shareSelector: HTMLLinkElement;
  private readonly resetSelector: NodeListOf<HTMLElement>;
  private readonly container: HTMLElement | null;

  constructor(
    $downloadElement: HTMLLinkElement,
    $shareElement: HTMLLinkElement,
    $resetElement: NodeListOf<HTMLElement>,
  ) {
    super();
    this.downloadSelector = $downloadElement;
    this.shareSelector = $shareElement;
    this.resetSelector = $resetElement;
    this.container = $downloadElement.parentElement;

    Array.from(this.resetSelector).map((element) => {
      element.addEventListener("click", () => {
        this.hide();
        this.publish({ state: MessageState.Reset });
      });
      return element;
    });

    if (!navigator.canShare()) {
      this.shareSelector.classList.add("download--hidden");
    }

    //When download link is clicked,publish, next image message
    this.downloadSelector.addEventListener("click", () => {
      this.hide();
      this.publish({ state: MessageState.NextImage });
    });
  }

  update(publication: Message) {
    if (publication.state === MessageState.CanvasWithMapReady) {
      this.show();
      this.prepareDownload();
    }
  }

  protected numberWithPadding(number: number) {
    return number.toString().padStart(2, "0");
  }

  generateFilename() {
    const today = new Date();
    return `map-on-photo-${today.getFullYear()}-${this.numberWithPadding(today.getMonth() + 1)}-${this.numberWithPadding(today.getDate())}-${this.numberWithPadding(today.getHours())}-${this.numberWithPadding(today.getMinutes())}-${this.numberWithPadding(today.getSeconds())}.jpg`;
  }

  prepareDownload() {
    const $canvas: HTMLElement | null =
      document.getElementById("js-main-canvas");

    if ($canvas == null) {
      warn("Canvas not found");
      return;
    }

    const dataURL = ($canvas as HTMLCanvasElement).toDataURL(
      "image/jpeg",
      0.95,
    );
    this.downloadSelector.setAttribute("download", this.generateFilename());
    this.downloadSelector.setAttribute("href", dataURL);

    if (navigator.canShare()) {
      this.shareSelector.addEventListener("click", (event) => {
        event.preventDefault();
        navigator.share({
          title: "See my photo with the embedded map",
          files: [
            new File([dataURL], this.generateFilename(), {
              type: "image/jpeg",
            }),
          ],
        });
      });
    }
  }

  hide() {
    this.container?.classList.add("download--hidden");
  }

  show() {
    this.container?.classList.remove("download--hidden");
  }
}
