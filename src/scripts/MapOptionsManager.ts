import Publisher from "./Publisher.class";
import {MessageState} from "./Message.type";

export default class MapOptionsManager extends Publisher {
    private selector: HTMLDivElement;
    private submit: HTMLButtonElement;
    private positionControls: NodeListOf<HTMLButtonElement>;
    private sizeControls: NodeListOf<HTMLButtonElement>;


    constructor($selector: HTMLDivElement) {
        super()

        this.selector = $selector;
        this.submit = this.selector.querySelector('button#js-map-options-submit') as HTMLButtonElement;
        this.positionControls = this.selector.querySelectorAll<HTMLButtonElement>('button[data-position]');
        this.sizeControls = this.selector.querySelectorAll<HTMLButtonElement>('button[data-size]');


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
    }

    sizeToDimensions(size: string): [number, number] {

        switch (size) {
            case "L":
                return [640, 480]
            case "M":
                return [480, 360];

            case 'S':
            default:
                return [320, 240]
        }

    }

}
