import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";
import * as EXIF from "exif-js";

export default class ExifManager extends ObserverPublisher(Publisher) {
  public static numeratorToLatLng = (
    numerator: [Number, Number, Number]
  ): number =>
    numerator[0].valueOf() +
    numerator[1].valueOf() / 60 +
    numerator[2].valueOf() / 3600;

  update(publication: Message) {
    if (publication.state === MessageState.FileReady) {
      const self = this;
      console.log("We can now deal with Exif data");

      EXIF.getData(publication.data as string, function () {
        // @ts-ignore
        const latitude = EXIF.getTag(this, "GPSLatitude");
        // @ts-ignore
        const longitude = EXIF.getTag(this, "GPSLongitude");
        // @ts-ignore
        const direction = EXIF.getTag(this, "GPSImgDirection");

        if (!latitude || !longitude) {
          console.warn("No GPS data found");
          self.publish({ state: MessageState.ExifMissing, data: null });
          return;
        }

        const lat = ExifManager.numeratorToLatLng(latitude);
        const lng = ExifManager.numeratorToLatLng(longitude);
        const dir = direction ? parseInt(direction.valueOf()) : 0;

        self.publish({
          state: MessageState.ExifReady,
          data: { lat, lng, dir },
        });
      });
    }
  }
}
