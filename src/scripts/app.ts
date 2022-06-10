import "../styles/styles.scss";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import leafletImage from "leaflet-image";
import CanvasManager from "./CanvasManager";
import { ExifManager } from "./ExifManager";
import ImageManager from "./ImageManager";
import PhotoBrowser from "./PhotoBrowser";

let map: L.Map;
let browser: PhotoBrowser;
let imageManager: ImageManager;
let canvasManager: CanvasManager;
let exifManager: ExifManager;

const prepareDownload = () => {
  const $downloadLink = document.getElementById("js-download");
  const $canvas = document.getElementById(
    "js-main-canvas"
  ) as HTMLCanvasElement;

  if (!$canvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!$downloadLink) {
    console.warn("Download link not found");
    return;
  }

  console.log("preparing download");
  const dataURL = $canvas.toDataURL("image/jpeg", 1.0);
  $downloadLink.setAttribute("download", "dimensions.jpg");
  $downloadLink.setAttribute("href", dataURL);
};

const drawCanvasMap = () => {
  leafletImage(map, function (err, canvas) {
    // now you have canvas
    // example thing to do with that canvas:
    var img = document.createElement("img");
    var dimensions = map.getSize();
    img.width = dimensions.x;
    img.height = dimensions.y;
    img.src = canvas.toDataURL();
    img.onload = function () {
      console.log("image is now ready");
      drawCanvasImage(this);
    };
  });
};

/*
const handleFile = (e?: Event) => {
  if (!e) {
    return;
  }
  const file = e?.target?.files?.[0] ?? null;

  if (!file) {
    return;
  }

  const img = document.createElement("img");
  // img.classList.add("img-fluid", "photo-preview", "js-photo-preview-image");
  // img.file = file;
  // $previewElement.replaceChildren(img);

  reader.onload = ((preview) => (e) => {
    preview.src = e?.target?.result ?? "";

    setTimeout(() => {
      clearCanvas();
      drawCanvasImage(img); //what if image is smaller than a canvas?

      processExif(img); //TODO return value
      drawCanvasMap();
    }, 100);

    setTimeout(() => {
      prepareDownload();
    }, 2000);
  })(img);

  reader.readAsDataURL(file);
};
*/
window.addEventListener("load", function () {
  const $browserElement = document.getElementById("js-browser-input");
  const $photoData = document.getElementById("js-photo-map");
  const $canvas = document.getElementById("js-main-canvas");

  if (!$browserElement || !$photoData || !$canvas) {
    console.warn("Missing elements");
    return;
  }

  browser = new PhotoBrowser($browserElement as HTMLInputElement);
  canvasManager = new CanvasManager($canvas as HTMLCanvasElement);
  imageManager = new ImageManager();
  exifManager = new ExifManager();

  browser.subscribe(imageManager); //we want to Image Manager to receive updates from the file browser

  imageManager.subscribe(canvasManager); //we want to Canvas Manager to receive updates from the image manager
  imageManager.subscribe(exifManager); //we want to Exif Manager to receive updates from the image manager

  // $photoInput.addEventListener("change", handleFile, false);

  map = L.map($photoData).setView([54.37933333, 18.40696389], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
});
