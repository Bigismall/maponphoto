import { useCallback, useRef } from "react";
import { useMessageBroker } from "../providers/MessageBrokerProvider.ts";
import { log } from "../scripts/console.ts";
import { isEmptyArray } from "../scripts/utils.ts";
import {
  type Message,
  type MessageListener,
  MessageState,
} from "../types/Message.type.ts";

const MIN_WIDTH = 640;
const MIN_HEIGHT = 400;

export const useImageManager = () => {
  const processFile = useCallback((file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const newImage = document.createElement("img");

      newImage.onload = () => {
        if (newImage.width < MIN_WIDTH || newImage.height < MIN_HEIGHT) {
          reject(
            new Error(
              `Image ${file.name} is too small. Minimum dimensions are: ${MIN_WIDTH}x${MIN_HEIGHT}`,
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
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Order issue>
  const listener = useCallback<MessageListener>(
    async (message: Message) => {
      if (message.state === MessageState.FileChange) {
        const event = message.data;
        const files = Array.from(
          (event.target as HTMLInputElement).files ?? [],
        );

        if (isEmptyArray(files)) {
          return;
        }

        const processedFiles = await Promise.allSettled(
          files.map<Promise<HTMLImageElement>>((file) => processFile(file)),
        );

        const images = processedFiles
          .filter(
            (result): result is PromiseFulfilledResult<HTMLImageElement> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);

        imagesRef.current = images;

        if (isEmptyArray(imagesRef.current)) {
          notify({
            state: MessageState.FileError,
            data: "No valid images found. Please ensure your images meet the minimum size requirements.",
          });
          return;
        }

        notify({
          state: MessageState.FileReady,
          data: imagesRef.current.shift() as HTMLImageElement,
        });
      }

      if (message.state === MessageState.NextImage) {
        if (isEmptyArray(imagesRef.current)) {
          notify({ state: MessageState.Reset });
          return;
        }

        notify({
          state: MessageState.FileReady,
          data: imagesRef.current.shift() as HTMLImageElement,
        });
      }
    },
    [processFile],
  );

  const { notify } = useMessageBroker({ listener: listener });
  const imagesRef = useRef<HTMLImageElement[]>([]);
};
