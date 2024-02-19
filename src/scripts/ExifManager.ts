import { type Message, MessageState } from './Message.type';
import ObserverPublisher from './ObserverPublisher';
import Publisher from './Publisher.class';
import exifr from 'exifr';
import { log, warn } from './console.ts';

export default class ExifManager extends ObserverPublisher(Publisher) {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor () {
    super();
  }

  update (publication: Message) {
    if (publication.state === MessageState.FileReady) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      log('We can now deal with Exif data');

      exifr.parse(publication.data, [
        'GPSLatitude',
        'GPSLongitude',
        'GPSImgDirection'
      ]).then((output) => {
        if (output == null) {
          warn('No GPS data found');
          self.publish({ state: MessageState.ExifMissing });
          return;
        }
        const { latitude, longitude, GPSImgDirection: direction } = output;

        if ((latitude == null) || (longitude == null)) {
          warn('No GPS data found');
          self.publish({ state: MessageState.ExifMissing });
          return;
        }

        log({ latitude, longitude, direction });
        self.publish({
          state: MessageState.ExifReady,
          data: { lat: latitude, lng: longitude, dir: direction }
        });
      }).catch((error) => {
        warn(error);
        self.publish({ state: MessageState.ExifMissing });
      });
    }
  }
}
