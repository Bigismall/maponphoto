import { Map } from "leaflet";
import { Message, MessageState } from "./Message.type";
import ObserverPublisher from "./ObserverPublisher";
import Publisher from "./Publisher.class";
import * as L from "leaflet";
// @ts-ignore
import leafletImage from "leaflet-image";

export default class MapManager extends ObserverPublisher(Publisher) {
  private selector: HTMLDivElement;
  protected map: Map;

  constructor($selector: HTMLDivElement) {
    super();

    this.selector = $selector;
    this.map = L.map($selector).setView([54.37933333, 18.40696389], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(this.map);
  }

  update(publication: Message) {
    if (publication.state === MessageState.ExifMissing) {
      console.warn("No EXIF GPS  data found");
      //TODO - display map with pointer
    }

    if (publication.state === MessageState.ExifReady) {
      const { lat, lng, dir } = publication.data as {
        lat: number;
        lng: number;
        dir: number;
      };
      console.log("Setting map to ", { lat, lng, dir });
      this.map.setView(L.latLng(lat, lng), 14);
      this.drawCanvasMap();
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
        self.publish({ state: MessageState.MapImageReady, data: img });
      };
    });
  }
}
