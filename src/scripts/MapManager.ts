import {Map, Marker} from "leaflet";
import {Message, MessageState} from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";
import * as L from "leaflet";
// @ts-ignore
import leafletImage from "leaflet-image";


/*
* TODO default center map in the center of Europe, save the latest position in local storage and use next time
*  AND ZOOM LEVEL
*
*/


const DEFAULT_CENTER: [number, number] = [54.403397, 18.570665];
const DEFAULT_ZOOM: number = 14;

export default class MapManager extends ObserverPublisher(Publisher) {
    private selector: HTMLDivElement;
    private container: HTMLElement | null;
    protected title: HTMLDivElement | null;
    protected map: Map;
    protected marker: Marker;

    constructor($selector: HTMLDivElement) {
        super();

        this.selector = $selector;
        this.container = $selector.parentElement ?? $selector;  // FIXME
        this.title = this.container.querySelector(".map__title");

        this.map = L.map($selector, {
            preferCanvas: true,
            renderer: L.canvas(),
        }).setView(DEFAULT_CENTER, 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap",
        }).addTo(this.map);


        this.marker = L.marker(this.map.getCenter(), {
            title: "Drag to change location",
            draggable: true,
            autoPan: true,
            icon: L.icon({
                iconUrl: ' data:image/png;base64,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',
                iconSize: [96, 96], // size of the icon
                iconAnchor: [48, 96], // point of the icon which will correspond to marker's location
                popupAnchor: [48, 0] // point from which the popup should open relative to the iconAnchor
            }),
        }).addTo(this.map);

        this.marker.on("dragend", () => {
            this.map.panTo(this.marker.getLatLng());
        })

    }

    update(publication: Message) {
        if (publication.state === MessageState.ExifMissing) {
            // console.warn("No EXIF GPS  data found");
            //cover photo with map  - big map with drag pointer and zoom and SAVE button
            this.show({title: true});
        }

        if (publication.state === MessageState.ExifReady) {
            this.show({title: false});
            const {lat, lng, dir} = publication.data as {
                lat: number;
                lng: number;
                dir: number;
            };
            console.log("Sett ing map to ", {lat, lng, dir});
            this.map.setView(L.latLng(lat, lng), 14);
            this.marker.setLatLng(L.latLng(lat, lng));


            // TODO Only call that when user submit the from
            //this.drawCanvasMap();
        }

        if (publication.state === MessageState.MapSetupReady) {
            // TODO get data
            this.drawCanvasMap()
        }
    }

    drawCanvasMap() {
        const self = this;

        leafletImage(this.map, function (err: Error, canvas: HTMLCanvasElement) {
            //TODO deal with error

            const img = document.createElement("img");
            const dimensions = self.map.getSize();

            img.width = dimensions.x;
            img.height = dimensions.y;
            img.src = canvas.toDataURL();
            img.onload = function () {
                console.log("image is now ready");
                self.publish({state: MessageState.MapImageReady, data: img});
                self.hide()

            };
            img.onerror = function (e) {
                console.error("MAP image is not ready", e);
            }
        });
    }

    hide() {
        this.container?.classList.add("map--hidden");
        this.title?.classList.add("map__title--hidden");
    }

    show({title}: { title: boolean }) {
        this.container?.classList.remove("map--hidden");
        if (title) {
            this.title?.classList.remove("map__title--hidden");
        }
    }
}
