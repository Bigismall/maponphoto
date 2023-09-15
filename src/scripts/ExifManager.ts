import { type Message, MessageState } from './Message.type'
import ObserverPublisher from './ObserverPublisher'
import Publisher from './Publisher.class'
import * as EXIF from 'exif-js'

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

      // @ts-expect-error  Wrong typing in EXIF package
      EXIF.getData(publication.data, function () {
        // @ts-expect-error due EXIF typings
        const latitude = EXIF.getTag(this, 'GPSLatitude') as Numerator | undefined
        // @ts-expect-error due EXIF typings
        const longitude = EXIF.getTag(this, 'GPSLongitude') as Numerator | undefined
        // @ts-expect-error due EXIF typings
        const direction = EXIF.getTag(this, 'GPSImgDirection') as string | undefined

        if ((latitude == null) || (longitude == null)) {
          console.warn('No GPS data found')
          self.publish({ state: MessageState.ExifMissing })
          return
        }

        const lat = ExifManager.numeratorToLatLng(latitude)
        const lng = ExifManager.numeratorToLatLng(longitude)
        const dir = (direction != null) ? parseInt(direction.valueOf()) : 0

        self.publish({
          state: MessageState.ExifReady,
          data: { lat, lng, dir }
        })
      })
    }
  }
}
