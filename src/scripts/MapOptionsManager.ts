import Publisher from './Publisher.class'
import { MessageState } from './Message.type'
import { type MapPosition } from './MapManager'

export default class MapOptionsManager extends Publisher {
  private readonly selector: HTMLDivElement
  private readonly submit: HTMLButtonElement
  private readonly positionControls: NodeListOf<HTMLButtonElement>
  private readonly sizeControls: NodeListOf<HTMLButtonElement>

  constructor ($selector: HTMLDivElement) {
    super()

    this.selector = $selector
    this.submit = this.selector.querySelector(
      'button#js-map-options-submit'
    ) as HTMLButtonElement
    this.positionControls = this.selector.querySelectorAll<HTMLButtonElement>(
      'button[data-position]'
    )
    this.sizeControls =
      this.selector.querySelectorAll<HTMLButtonElement>('button[data-size]')

    this.submit.addEventListener('click', () => {
      this.publish({
        state: MessageState.MapSetupReady,
        data: {}
      })
    })

    this.sizeControls.forEach(($button) => {
      $button.addEventListener('click', () => {
        this.publish({
          state: MessageState.ResizeMap,
          data: $button.dataset.size
        })
      })
    })

    this.positionControls.forEach(($button) => {
      $button.addEventListener('click', () => {
        this.publish({
          state: MessageState.MoveMap,
          data: $button.dataset.position as MapPosition
        })
      })
    })
  }
}
