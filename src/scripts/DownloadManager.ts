import { type Message, MessageState } from './Message.type';
import ObserverPublisher from './ObserverPublisher';
import Publisher from './Publisher.class';

export default class DownloadManager extends ObserverPublisher(Publisher) {
  private readonly downloadSelector: HTMLLinkElement;
  private readonly resetSelector: HTMLButtonElement;
  private readonly container: HTMLElement | null;

  constructor (
    $downloadElement: HTMLLinkElement,
    $resetElement: HTMLButtonElement
  ) {
    super();
    this.downloadSelector = $downloadElement;
    this.resetSelector = $resetElement;
    this.container = $downloadElement.parentElement;

    this.resetSelector.addEventListener('click', () => {
      this.hide();
      this.publish({ state: MessageState.Reset });
    });
  }

  update (publication: Message) {
    if (publication.state === MessageState.CanvasWithMapReady) {
      this.show();
      this.prepareDownload();
    }
  }

  protected numberWithPadding (number: number) {
    return number.toString().padStart(2, '0');
  }

  generateFilename () {
    const today = new Date();
    return `map-on-photo-${today.getFullYear()}-${this.numberWithPadding(today.getMonth() + 1)}-${this.numberWithPadding(today.getDate())}-${this.numberWithPadding(today.getHours())}-${this.numberWithPadding(today.getMinutes())}-${this.numberWithPadding(today.getSeconds())}.jpg`;
  }

  prepareDownload () {
    const $canvas: HTMLElement | null = document.getElementById(
      'js-main-canvas'
    );

    if ($canvas == null) {
      console.warn('Canvas not found');
      return;
    }

    const dataURL = ($canvas as HTMLCanvasElement).toDataURL('image/jpeg', 0.8);
    this.downloadSelector.setAttribute('download', this.generateFilename());
    this.downloadSelector.setAttribute('href', dataURL);
  }

  hide () {
    this.container?.classList.add('download--hidden');
  }

  show () {
    this.container?.classList.remove('download--hidden');
  }
}
