import { useCallback, useRef } from "react";
import { useMessageBroker } from "../providers/MessageBrokerProvider.ts";
import {
  type Message,
  type MessageListener,
  MessageState,
} from "../types/Message.type.ts";
import { log } from "../utils/console.ts";
import { isEmptyArray } from "../utils/utils.ts";

const MIN_WIDTH = 640;
const MIN_HEIGHT = 400;

const processFile = (file: File): Promise<HTMLImageElement> => {
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
};

export const useImageManager = () => {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const { notify, registerListener } = useMessageBroker();

  const fileChange = useCallback(
    async (
      message: Message & { state: MessageState.FileChange },
      notify: ReturnType<typeof useMessageBroker>["notify"],
    ) => {
      const event = message.data;
      const files = Array.from((event.target as HTMLInputElement).files ?? []);

      if (isEmptyArray(files)) {
        return;
      }

      const processedFiles = await Promise.allSettled(
        files.map<Promise<HTMLImageElement>>((file) => processFile(file)),
      );

      imagesRef.current = processedFiles
        .filter(
          (result): result is PromiseFulfilledResult<HTMLImageElement> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

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
    },
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: notify is stable in message broker context
  const listener = useCallback<MessageListener>(async (message: Message) => {
    if (message.state === MessageState.FileChange) {
      fileChange(message, notify);
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
  }, []);

  registerListener(listener);
};
