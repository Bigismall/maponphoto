import {
  type Message,
  type MessageListener,
  MessageState,
} from "@app-types/Message.type.ts";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";
import { log, warn } from "@utils/console.ts";
import exifr from "exifr";
import { useCallback } from "react";

export const useExifManager = () => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: notify is stable in message broker context
  const listener = useCallback<MessageListener>((message: Message) => {
    if (message.state === MessageState.FileReady) {
      log("We can now deal with Exif data");

      exifr
        .parse(message.data, ["GPSLatitude", "GPSLongitude", "GPSImgDirection"])
        .then((output) => {
          if (output == null) {
            warn("No GPS data found");
            notify({ state: MessageState.ExifMissing });
            return;
          }
          const { latitude, longitude, GPSImgDirection: direction } = output;

          if (latitude == null || longitude == null) {
            warn("No GPS data found");
            notify({ state: MessageState.ExifMissing });
            return;
          }

          log({ latitude, longitude, direction });
          notify({
            state: MessageState.ExifReady,
            data: { lat: latitude, lng: longitude, dir: direction },
          });
        })
        .catch((error) => {
          warn(error);
          notify({ state: MessageState.ExifMissing });
        });
    }
  }, []);

  const { notify, registerListener } = useMessageBroker();
  registerListener(listener);
};
