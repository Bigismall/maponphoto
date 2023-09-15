import { type Message, MessageState } from './Message.type'
import ObserverPublisher from './ObserverPublisher'
import Publisher from './Publisher.class'

export default class PhotoBrowser extends ObserverPublisher(Publisher) {
  private readonly selector: HTMLInputElement
  private readonly container: HTMLElement | null

  constructor ($selector: HTMLInputElement) {
    super()
    this.selector = $selector
    this.container = $selector.parentElement

    this.selector.addEventListener(
      'change',
      (e: Event) => {
        this.publish({ state: MessageState.FileChange, data: e })
        this.hide()
      },
      false
    )
  }

  update (publication: Message) {
    if (publication.state === MessageState.Reset) {
      this.show()
    }
  }

  hide () {
    this.container?.classList.add('browser--hidden')
  }

  show () {
    this.container?.classList.remove('browser--hidden')
  }
}
