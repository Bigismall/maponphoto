import { warn } from "./console.ts";
import { type Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

export default class DownloadManager extends ObserverPublisher(Publisher) {
  private readonly downloadSelector: HTMLLinkElement;
  private readonly shareSelector: HTMLElement;
  private readonly resetSelector: NodeListOf<HTMLElement>;
  private readonly container: HTMLElement | null;
  private downloadBlob: Blob | null;
  private blobUrl: string | null;

  private get canShareFiles(): boolean {
    return (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function"
    );
  }

  constructor(
    $downloadElement: HTMLLinkElement,
    $shareElement: HTMLElement,
    $resetElement: NodeListOf<HTMLElement>,
  ) {
    super();
    this.downloadSelector = $downloadElement;
    this.shareSelector = $shareElement;
    this.resetSelector = $resetElement;
    this.container = $downloadElement.parentElement;
    this.downloadBlob = null;
    this.blobUrl = null;

    Array.from(this.resetSelector).map((element) => {
      element.addEventListener("click", () => {
        this.hide();
        this.publish({ state: MessageState.Reset });
      });
      return element;
    });

    if (!this.canShareFiles) {
      this.shareSelector.classList.add("download--hidden");
    } else {
      this.shareSelector.addEventListener("click", (event) => {
        void this.share(event);
      });
    }

    //When download link is clicked,publish, NextImage message
    this.downloadSelector.addEventListener("click", () => {
      setTimeout(() => {
        this.hide();
        this.publish({ state: MessageState.NextImage });
      }, 0);
    });
  }

  update(publication: Message) {
    if (publication.state === MessageState.CanvasWithMapReady) {
      this.show();
      this.prepareDownload(publication.data);
    }
  }

  private revokeBlobUrl() {
    if (this.blobUrl === null) {
      return;
    }

    URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = null;
  }

  private clearDownloadState() {
    this.revokeBlobUrl();
    this.downloadBlob = null;
    this.downloadSelector.removeAttribute("href");
  }

  protected numberWithPadding(number: number) {
    return number.toString().padStart(2, "0");
  }

  generateFilename() {
    const today = new Date();
    return `map-on-photo-${today.getFullYear()}-${this.numberWithPadding(today.getMonth() + 1)}-${this.numberWithPadding(today.getDate())}-${this.numberWithPadding(today.getHours())}-${this.numberWithPadding(today.getMinutes())}-${this.numberWithPadding(today.getSeconds())}.jpg`;
  }

  prepareDownload(blob: Blob) {
    this.revokeBlobUrl();
    this.downloadBlob = blob;
    this.blobUrl = URL.createObjectURL(blob);

    this.downloadSelector.setAttribute("download", this.generateFilename());
    this.downloadSelector.setAttribute("href", this.blobUrl);
  }

  private async share(event: Event) {
    event.preventDefault();

    if (!this.downloadBlob) {
      warn("No image ready to share");
      return;
    }

    const file = new File([this.downloadBlob], this.generateFilename(), {
      type: "image/jpeg",
    });

    if (!this.canShareFiles || !navigator.canShare({ files: [file] })) {
      warn("Sharing files is not supported in this browser");
      return;
    }

    try {
      await navigator.share({
        title: "See my photo with the embedded map",
        files: [file],
      });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      warn("Failed to share image");
    }
  }

  hide() {
    this.clearDownloadState();
    this.container?.classList.add("download--hidden");
  }

  show() {
    this.container?.classList.remove("download--hidden");
  }
}
