import {Message, MessageState} from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";

// 4/3
const MAX_WIDTH = 1280;
const MAX_HEIGHT = 960;
const MIN_WIDTH = 640;
const MIN_HEIGHT = 480;

export default class CanvasManager extends ObserverPublisher(Publisher) {
    private readonly selector: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    constructor($selector: HTMLCanvasElement) {
        super();
        this.selector = $selector;
        this.context = this.selector.getContext("2d");
        console.log("Canvas", this.width, this.height, this.aspectRatio);
    }

    get height(): number {
        return this.selector.height;
    }

    get width(): number {
        return this.selector.width;
    }

    get aspectRatio(): number {
        return this.width / this.height;
    }

    protected clear() {
        this.context?.clearRect(0, 0, this.width, this.height);
    }

    protected resizeFor(width: number, height: number) {
        const ratio = width / height;
        let newWidth = 0;
        let newHeight = 0;

        if (ratio > 1) {
            newWidth = Math.min(MAX_WIDTH, width);
            newHeight = newWidth / ratio;
        } else {
            newHeight = Math.min(MAX_HEIGHT, height);
            newWidth = newHeight * ratio;
        }

        console.log("Resize", newWidth, newHeight, newWidth / newHeight);
        this.selector.width = newWidth;
        this.selector.height = newHeight;
        console.log("Canvas", this.width, this.height, this.aspectRatio);
    }

    protected draw(image: CanvasImageSource) {
        const {width, height} = image as HTMLImageElement;
        this.resizeFor(width, height);

        this.context?.drawImage(image, 0, 0, this.width, this.height);
    }

    protected drawMap(image: CanvasImageSource) {
        this.context?.drawImage(image, 0, 0);
    }

    update(publication: Message) {
        if (publication.state === MessageState.Reset) {
            this.clear();
        }

        if (publication.state === MessageState.FileReady) {
            this.clear();
            this.draw(publication.data as CanvasImageSource);
        }

        if (publication.state === MessageState.MapImageReady) {
            this.drawMap(publication.data as CanvasImageSource);
            this.publish({
                state: MessageState.CanvasWithMapReady,
                data: this.selector,
            });
        }
    }
}
