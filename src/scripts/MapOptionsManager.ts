import type { MapPosition } from "./MapManager";
import { MessageState } from "./Message.type";
import Publisher from "./Publisher.class";

export default class MapOptionsManager extends Publisher {
  private readonly selector: HTMLDivElement;
  private readonly submit: HTMLButtonElement;
  private readonly positionControls: NodeListOf<HTMLButtonElement>;
  private readonly sizeControls: NodeListOf<HTMLButtonElement>;

  constructor($selector: HTMLDivElement) {
    super();

    this.selector = $selector;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    this.submit = this.selector.querySelector("button#js-map-options-submit")!;
    this.positionControls = this.selector.querySelectorAll<HTMLButtonElement>(
      "button[data-position]",
    );
    this.sizeControls =
      this.selector.querySelectorAll<HTMLButtonElement>("button[data-size]");

    this.submit.addEventListener("click", () => {
      this.publish({
        state: MessageState.MapSetupReady,
      });
    });

    for (const $button of this.sizeControls) {
      $button.addEventListener("click", () => {
        this.publish({
          state: MessageState.ResizeMap,
          data: $button.dataset.size ?? "",
        });
      });
    }

    for (const $button of this.positionControls) {
      $button.addEventListener("click", () => {
        this.publish({
          state: MessageState.MoveMap,
          data: $button.dataset.position as MapPosition,
        });
      });
    }
  }
}
