import "leaflet/dist/leaflet.css";
import pkg from "../../package.json";
import "../styles/styles.scss";
import CanvasManager from "./CanvasManager";
import { warn } from "./console.ts";
import DownloadManager from "./DownloadManager";
import { $, $$ } from "./dom.ts";
import ExifManager from "./ExifManager";
import ImageManager from "./ImageManager";
import MapManager from "./MapManager";
import MapOptionsManager from "./MapOptionsManager";
import PhotoBrowser from "./PhotoBrowser";

let browser: PhotoBrowser;
let imageManager: ImageManager;
let canvasManager: CanvasManager;
let exifManager: ExifManager;
let mapManager: MapManager;
let mapOptionsManager: MapOptionsManager;
let downloadManager: DownloadManager;

const supportsShareFiles =
  typeof navigator.share === "function" &&
  typeof navigator.canShare === "function";

window.addEventListener("load", () => {
  const $elements = new Map<string, Element | NodeListOf<HTMLElement> | null>([
    ["browser", $("#js-browser-input")],
    ["photo", $("#js-map")],
    ["canvas", $("#js-main-canvas")],
    ["download", $("#js-download")],
    ["share", $("#js-share")],
    ["reset", $$(".js-reset")], // At least 2 elements have this class
    ["mapOptions", $("#js-map-options")],
    ["appVersion", $("#js-app-version")],
  ]);

  // Check if all elements are different from null
  $elements.forEach(($element, key) => {
    if ($element === null) {
      warn(`Missing element ${key}`);
    }
  });

  if (!supportsShareFiles) {
    console.log("Web Share API not supported :(");
  }

  browser = new PhotoBrowser($elements.get("browser") as HTMLInputElement);
  downloadManager = new DownloadManager(
    $elements.get("download") as HTMLLinkElement,
    $elements.get("share") as HTMLLinkElement,
    $elements.get("reset") as NodeListOf<HTMLElement>,
  );

  canvasManager = new CanvasManager(
    $elements.get("canvas") as HTMLCanvasElement,
  );
  mapManager = new MapManager($elements.get("photo") as HTMLDivElement);
  mapOptionsManager = new MapOptionsManager(
    $elements.get("mapOptions") as HTMLDivElement,
  );
  imageManager = new ImageManager();
  exifManager = new ExifManager();

  browser.subscribe(imageManager); // we want to Image Manager to receive updates from the file browser
  canvasManager.subscribe(downloadManager); // we want to Download Manager to receive updates from the canvas manager
  canvasManager.subscribe(imageManager); // we want to Map Manager to receive updates from the canvas manager (to hide map when canvas is hidden)
  downloadManager.subscribe(browser); // we want to Browser to receive updates from the download manager
  downloadManager.subscribe(canvasManager); // we want to Canvas Manager to receive updates from the download manager
  downloadManager.subscribe(imageManager); // We want to Image Manager to receive updates from the download manager
  downloadManager.subscribe(mapManager); // we want to Map Manager to receive updates from the download manager
  exifManager.subscribe(mapManager); // we want to Map Manager to receive updates from the exif manager
  imageManager.subscribe(browser); // we want to Browser to receive updates from the image manager (to hide browser when image is loaded)
  imageManager.subscribe(canvasManager); // we want to Canvas Manager to receive updates from the image manager
  imageManager.subscribe(exifManager); // we want to Exif Manager to receive updates from the image manager
  imageManager.subscribe(mapManager); // we want to Map Manager to receive updates from the image manager
  mapManager.subscribe(canvasManager); // we want to Canvas Manager to receive updates from the map manager
  mapOptionsManager.subscribe(mapManager); // we want to Map Manager to receive updates from the map options manager

  // Set the app version in the footer
  // @ts-expect-error
  $elements.get("appVersion").innerText = `v${pkg.version}`;
});
