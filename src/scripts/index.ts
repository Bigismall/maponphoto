import '../styles/styles.scss';
import 'leaflet/dist/leaflet.css';

import CanvasManager from './CanvasManager';
import DownloadManager from './DownloadManager';
import ExifManager from './ExifManager';
import ImageManager from './ImageManager';
import MapManager from './MapManager';
import PhotoBrowser from './PhotoBrowser';
import MapOptionsManager from './MapOptionsManager';
import { $, $$ } from './dom.ts';

let browser: PhotoBrowser;
let imageManager: ImageManager;
let canvasManager: CanvasManager;
let exifManager: ExifManager;
let mapManager: MapManager;
let mapOptionsManager: MapOptionsManager;
let downloadManager: DownloadManager;

window.addEventListener('load', function () {
  const $elements = new Map<string, Element | NodeListOf<HTMLElement> | null>([
    ['browser', $('#js-browser-input')],
    ['photo', $('#js-map')],
    ['canvas', $('#js-main-canvas')],
    ['download', $('#js-download')],
    ['reset', $$('.js-reset')], // At least 2 elements have this class
    ['mapOptions', $('#js-map-options')]
  ]);

  // Check if all elements are different from null
  $elements.forEach(($element, key) => {
    if ($element === null) {
      console.warn(`Missing element ${key}`);
    }
  });

  console.log($elements.get('reset'));

  browser = new PhotoBrowser($elements.get('browser') as HTMLInputElement);
  downloadManager = new DownloadManager(
    $elements.get('download') as HTMLLinkElement,
    $elements.get('reset') as NodeListOf<HTMLElement>
  );

  canvasManager = new CanvasManager($elements.get('canvas') as HTMLCanvasElement);
  mapManager = new MapManager($elements.get('photo') as HTMLDivElement);
  mapOptionsManager = new MapOptionsManager(
    $elements.get('mapOptions') as HTMLDivElement
  );
  imageManager = new ImageManager();
  exifManager = new ExifManager();

  browser.subscribe(imageManager); // we want to Image Manager to receive updates from the file browser
  imageManager.subscribe(canvasManager); // we want to Canvas Manager to receive updates from the image manager
  imageManager.subscribe(exifManager); // we want to Exif Manager to receive updates from the image manager
  exifManager.subscribe(mapManager); // we want to Map Manager to receive updates from the exif manager
  mapManager.subscribe(canvasManager); // we want to Canvas Manager to receive updates from the map manager
  mapOptionsManager.subscribe(mapManager); // we want to Map Manager to receive updates from the map options manager
  canvasManager.subscribe(downloadManager); // we want to Download Manager to receive updates from the canvas manager
  downloadManager.subscribe(browser); // we want to Browser to receive updates from the download manager
  downloadManager.subscribe(canvasManager); // we want to Canvas Manager to receive updates from the download manager
  downloadManager.subscribe(mapManager);// we want to Map Manager to receive updates from the download manager
});
