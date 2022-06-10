import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";
import * as EXIF from "exif-js";

/*
const processExif = (img) => {
  EXIF.getData(img, function () {
    // const altitude = EXIF.getTag(this, "GPSAltitude").valueOf();
    // const direction = EXIF.getTag(this, "GPSImgDirection").valueOf();

    const latitude = EXIF.getTag(this, "GPSLatitude");
    const longitude = EXIF.getTag(this, "GPSLongitude");

    if (!latitude || !longitude) {
      console.warn("No GPS data found");
      return;
    }

    const numericLatitude = numeratorToLatLng(latitude);
    const numericLongitude = numeratorToLatLng(longitude);

    if (map) {
      console.log("Setting map to ", {
        numericLatitude,
        numericLongitude,
      });
      map.setView(L.latLng(numericLatitude, numericLongitude), 14);
    } else {
      console.warn("Map not initialized");
    }
  });
};
 */

export class ExifManager extends ObserverPublisher(Publisher) {
  public static numeratorToLatLng = (
    numerator: [Number, Number, Number]
  ): number =>
    numerator[0].valueOf() +
    numerator[1].valueOf() / 60 +
    numerator[2].valueOf() / 3600;

  update(publication: Message) {
    if (publication.state === MessageState.FileReady) {
      console.log("We can now deal with Exif data");

      EXIF.getData(publication.data, function () {
        const latitude = EXIF.getTag(this, "GPSLatitude");
        const longitude = EXIF.getTag(this, "GPSLongitude");

        if (!latitude || !longitude) {
          console.warn("No GPS data found");
          return;
        }

        const numericLatitude = ExifManager.numeratorToLatLng(latitude);
        const numericLongitude = ExifManager.numeratorToLatLng(longitude);

        console.log(numericLatitude, numericLongitude);
        //depend on result return 2 different messages
      });
    }
  }
}
