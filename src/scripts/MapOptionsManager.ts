import Publisher from "./Publisher.class";
import {MessageState} from "./Message.type";


export default class MapOptionsManager extends Publisher {
    private selector: HTMLDivElement;
    private submit: HTMLButtonElement;


    constructor($selector: HTMLDivElement) {
        super()

        this.selector = $selector;
        this.submit = this.selector.querySelector('button#js-map-options-submit') as HTMLButtonElement;


        this.submit.addEventListener('click', () => {
            this.publish({
                state: MessageState.MapSetupReady,
                data: {}
            })
        })
    }
}
