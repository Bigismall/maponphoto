import "../styles/styles.scss";
import "leaflet/dist/leaflet.css";

import CanvasManager from "./CanvasManager";
import DownloadManager from "./DownloadManager";
import ExifManager from "./ExifManager";
import ImageManager from "./ImageManager";
import MapManager from "./MapManager";
import PhotoBrowser from "./PhotoBrowser";

let browser: PhotoBrowser;
let imageManager: ImageManager;
let canvasManager: CanvasManager;
let exifManager: ExifManager;
let mapManager: MapManager;
let downloadManager: DownloadManager;

window.addEventListener("load", function () {
  const $browserElement = document.getElementById("js-browser-input");
  const $photoElement = document.getElementById("js-photo-map");
  const $canvasElement = document.getElementById("js-main-canvas");
  const $downloadElement = document.getElementById("js-download");
  const $resetElement = document.getElementById("js-reset");

  if (
    !$browserElement ||
    !$photoElement ||
    !$canvasElement ||
    !$downloadElement ||
    !$resetElement
  ) {
    console.warn("Missing elements");
    return;
  }

  browser = new PhotoBrowser($browserElement as HTMLInputElement);
  downloadManager = new DownloadManager(
    $downloadElement as HTMLLinkElement,
    $resetElement as HTMLButtonElement
  );
  canvasManager = new CanvasManager($canvasElement as HTMLCanvasElement);
  mapManager = new MapManager($photoElement as HTMLDivElement);
  imageManager = new ImageManager();
  exifManager = new ExifManager();

  browser.subscribe(imageManager); //we want to Image Manager to receive updates from the file browser
  imageManager.subscribe(canvasManager); //we want to Canvas Manager to receive updates from the image manager
  imageManager.subscribe(exifManager); //we want to Exif Manager to receive updates from the image manager
  exifManager.subscribe(mapManager); //we want to Map Manager to receive updates from the exif manager
  mapManager.subscribe(canvasManager); //we want to Canvas Manager to receive updates from the map manager
});
