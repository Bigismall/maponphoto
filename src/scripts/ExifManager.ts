import { type Message, MessageState } from './Message.type'
import ObserverPublisher from './ObserverPublisher'
import Publisher from './Publisher.class'
import exifr from 'exifr'

export type Numerator = [number, number, number]

export default class ExifManager extends ObserverPublisher(Publisher) {
  public static numeratorToLatLng = (
    numerator: Numerator
  ): number =>
    numerator[0].valueOf() +
    numerator[1].valueOf() / 60 +
    numerator[2].valueOf() / 3600

  update (publication: Message) {
    if (publication.state === MessageState.FileReady) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      console.log('We can now deal with Exif data')

      exifr.parse(publication.data, [
        'GPSLatitude',
        'GPSLongitude',
        'GPSImgDirection'
      ]).then((output) => {
        if (output == null) {
          console.warn('No GPS data found')
          self.publish({ state: MessageState.ExifMissing })
          return
        }
        const { latitude, longitude, GPSImgDirection: direction } = output

        if ((latitude == null) || (longitude == null)) {
          console.warn('No GPS data found')
          self.publish({ state: MessageState.ExifMissing })
          return
        }

        console.log({ latitude, longitude, direction })
        self.publish({
          state: MessageState.ExifReady,
          data: { lat: latitude, lng: longitude, dir: direction }
        })
      }).catch((error) => {
        console.warn(error)
        self.publish({ state: MessageState.ExifMissing })
      })
    }
  }
}
