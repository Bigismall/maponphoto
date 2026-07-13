import exifr from "exifr";
import { Publisher } from "../lib/MessageBroker/Publisher.class.ts";
import { type Message, MessageState } from "../types/Message.type.ts";
import { log, warn } from "./console.ts";
import ObserverPublisher from "./ObserverPublisher";

export default class ExifManager extends ObserverPublisher(Publisher) {
  constructor() {
    super();
    log("ExifManager initialized");
  }

  update(publication: Message) {
    if (publication.state === MessageState.FileReady) {
      log("We can now deal with Exif data");

      exifr
        .parse(publication.data, [
          "GPSLatitude",
          "GPSLongitude",
          "GPSImgDirection",
        ])
        .then((output) => {
          if (output == null) {
            warn("No GPS data found");
            this.publish({ state: MessageState.ExifMissing });
            return;
          }
          const { latitude, longitude, GPSImgDirection: direction } = output;

          if (latitude == null || longitude == null) {
            warn("No GPS data found");
            this.publish({ state: MessageState.ExifMissing });
            return;
          }

          log({ latitude, longitude, direction });
          this.publish({
            state: MessageState.ExifReady,
            data: { lat: latitude, lng: longitude, dir: direction },
          });
        })
        .catch((error) => {
          warn(error);
          this.publish({ state: MessageState.ExifMissing });
        });
    }
  }
}
