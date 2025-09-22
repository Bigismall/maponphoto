import { log } from "./console.ts";
import { type Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

const MIN_WIDTH = 640;
const MIN_HEIGHT = 400;

export default class ImageManager extends ObserverPublisher(Publisher) {
  private images: HTMLImageElement[] = [];

  constructor() {
    super();
  }

  async update(publication: Message) {
    if (publication.state === MessageState.FileChange) {
      const event = publication.data;
      const files = Array.from((event.target as HTMLInputElement).files ?? []);

      if (files.length === 0) {
        return;
      }

      const processedFiles = await Promise.allSettled(
        files.map<Promise<HTMLImageElement>>((file) => this.processFile(file)),
      );

      this.images = processedFiles
        .filter(
          (result): result is PromiseFulfilledResult<HTMLImageElement> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      if (this.images.length === 0) {
        this.publish({
          state: MessageState.FileError,
          data: "No valid images found. Please ensure your images meet the minimum size requirements.",
        });
      }

      this.publish({
        state: MessageState.FileReady,
        data: this.images.pop() as HTMLImageElement,
      });
    }

    // if Next file
    if (publication.state === MessageState.NextImage) {
      //If no images, then reset state
      if (this.images.length === 0) {
        this.publish({ state: MessageState.Reset });
        return;
      }

      if (this.images.length > 0) {
        this.publish({
          state: MessageState.FileReady,
          data: this.images.pop() as HTMLImageElement,
        });
      }
    }
  }

  private processFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const newImage = document.createElement("img");

      newImage.onload = () => {
        if (newImage.width < MIN_WIDTH || newImage.height < MIN_HEIGHT) {
          reject(
            new Error(
              `Image ${file.name} is too small. Min dimension is: ${MIN_WIDTH}x${MIN_HEIGHT}`,
            ),
          );
          return;
        }
        resolve(newImage);
      };

      newImage.onerror = () => {
        reject(new Error(`Failed to load image: ${file.name}`));
      };

      reader.onload = (e: ProgressEvent<FileReader>) => {
        log(`File reader onload for: ${file.name}`);
        newImage.src = (e.target?.result ?? "") as string;
      };

      reader.onerror = () => {
        reject(
          new Error(
            `Error reading file ${file.name}: ${reader.error?.message ?? "Unknown error"}`,
          ),
        );
      };

      reader.readAsDataURL(file);
    });
  }
}
