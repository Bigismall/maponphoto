import { type Message, MessageState } from './Message.type'
import ObserverPublisher from './ObserverPublisher'
import Publisher from './Publisher.class'

const MIN_WIDTH = 640
const MIN_HEIGHT = 400

export default class ImageManager extends ObserverPublisher(Publisher) {
  private image: HTMLImageElement = document.createElement('img')

  update (publication: Message) {
    if (publication.state === MessageState.FileChange) {
      const event = publication.data
      const reader = new FileReader()

      const file = (event?.target as HTMLInputElement)?.files?.[0] ?? null

      if (file == null) {
        return
      }

      this.image = document.createElement('img')
      this.image.onload = () => {
        if (this.image.width < MIN_WIDTH || this.image.height < MIN_HEIGHT) {
          this.publish({
            state: MessageState.FileError,
            data: `Image is to small. Min dimension is: ${MIN_WIDTH}x${MIN_HEIGHT}`
          })
          return
        }
        this.publish({ state: MessageState.FileReady, data: this.image })
      }

      reader.onload = (e: ProgressEvent<FileReader>) => {
        console.log('File reader onload')

        this.image.src = (e?.target?.result ?? '') as string
      }

      reader.onerror = (e) => {
        this.publish({ state: MessageState.FileError, data: reader?.error?.message ?? '' })
        console.error(reader.error)
        console.error(e)
      }

      reader.readAsDataURL(file)
    }
  }
}
