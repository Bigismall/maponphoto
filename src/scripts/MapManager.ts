import * as L from 'leaflet';
import { type Map, type Marker } from 'leaflet';
import { type Message, MessageState } from './Message.type';
import ObserverPublisher from './ObserverPublisher';
import Publisher from './Publisher.class';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import leafletImage from 'leaflet-image';
import { markerIcon } from './marker.ts';

/*
 * TODO default center map in the center of Europe, save the latest position in local storage and use next time
 *  AND ZOOM LEVEL
 *
 */

const DEFAULT_CENTER: [number, number] = [54.403397, 18.570665];
// const DEFAULT_ZOOM: number = 14

export enum MapPosition {
  TOP_LEFT = 'topleft',
  TOP_RIGHT = 'topright',
  BOTTOM_LEFT = 'bottomleft',
  BOTTOM_RIGHT = 'bottomright',
  CENTER = 'center',
}

export default class MapManager extends ObserverPublisher(Publisher) {
  private readonly selector: HTMLDivElement;
  private readonly container: HTMLElement | null;
  protected title: HTMLDivElement | null;
  protected map: Map;
  protected marker: Marker;
  protected position: MapPosition;

  constructor ($selector: HTMLDivElement) {
    super();

    this.selector = $selector;
    this.container = $selector.parentElement ?? $selector;
    this.title = this.container.querySelector('.map__title');
    this.position = MapPosition.CENTER; // by default

    this.map = L.map($selector, {
      preferCanvas: true,
      renderer: L.canvas()
    }).setView(DEFAULT_CENTER, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.marker = L.marker(this.map.getCenter(), {
      title: 'Drag to change location',
      draggable: true,
      autoPan: true
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      this.map.panTo(this.marker.getLatLng());
    });

    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
    });

    resizeObserver.observe(this.selector);
  }

  update (publication: Message) {
    if (publication.state === MessageState.ExifMissing) {
      // console.warn("No EXIF GPS  data found");
      // cover photo with map  - big map with drag pointer and zoom and SAVE button
      this.marker.setIcon(
        L.icon({
          iconUrl: markerIcon(null),
          iconSize: [80, 80], // size of the icon
          iconAnchor: [40, 80], // point of the icon which will correspond to marker's location
          popupAnchor: [40, 0] // point from which the popup should open relative to the iconAnchor
        })
      );
      this.show({ title: true });
    }

    if (publication.state === MessageState.ExifReady) {
      this.show({ title: false });
      const { lat, lng, dir } = publication.data as {
        lat: number
        lng: number
        dir: number
      };
      console.log('Sett coordinates map to ', { lat, lng, dir });
      this.map.setView(L.latLng(lat, lng), 14);
      this.marker.setLatLng(L.latLng(lat, lng));
      this.marker.setIcon(
        L.icon({
          iconUrl: markerIcon(dir),
          iconSize: [80, 80], // size of the icon
          iconAnchor: [40, 80], // point of the icon which will correspond to marker's location
          popupAnchor: [40, 0] // point from which the popup should open relative to the iconAnchor
        })
      );
    }

    if (publication.state === MessageState.ResizeMap) {
      console.log(publication.data);
      this.selector.classList.remove(
        'map__canvas--small',
        'map__canvas--medium',
        'map__canvas--large'
      );
      this.selector.classList.add(publication.data);
    }

    if (publication.state === MessageState.MoveMap) {
      const position: MapPosition = publication.data;
      this.position = position;
      this.container?.classList.remove(
        'map--topleft',
        'map--topright',
        'map--bottomleft',
        'map--bottomright'
      );
      this.container?.classList.add(`map--${position}`);
    }

    if (publication.state === MessageState.MapSetupReady) {
      this.drawCanvasMap();
    }
  }

  drawCanvasMap () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    leafletImage(this.map, function (err: Error, canvas: HTMLCanvasElement) {
      // TODO deal with error
      console.log(err);
      const img = document.createElement('img');
      const dimensions = self.map.getSize();

      img.width = dimensions.x;
      img.height = dimensions.y;
      img.src = canvas.toDataURL();
      img.onload = function () {
        console.log('image is now ready');
        self.publish({
          state: MessageState.MapImageReady,
          data: { image: img, position: self.position }
        });
        self.hide();
      };
      img.onerror = function (e) {
        console.error('MAP image is not ready', e);
      };
    });
  }

  hide () {
    this.container?.classList.add('map--hidden');
    this.title?.classList.add('map__title--hidden');
  }

  show ({ title }: { title: boolean }) {
    this.container?.classList.remove('map--hidden');
    if (title) {
      this.title?.classList.remove('map__title--hidden');
    }
  }
}
