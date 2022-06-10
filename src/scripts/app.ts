import "../styles/styles.scss";

import * as EXIF from "exif-js";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import leafletImage from "leaflet-image";

let map: L.Map;
let reader = new FileReader();

const numeratorToLatLng = (numerator: [Number, Number, Number]): number =>
  numerator[0].valueOf() +
  numerator[1].valueOf() / 60 +
  numerator[2].valueOf() / 3600;

const drawCanvasImage = (img: HTMLImageElement) => {
  console.log("drawing canvas image");
  const $canvas = document.getElementById(
    "js-main-canvas"
  ) as HTMLCanvasElement;
  if (!$canvas) {
    console.warn("Canvas not found");
    return;
  }
  const $canvasContext = $canvas.getContext("2d");

  $canvasContext.drawImage(img, 0, 0);
};

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

const processExif = (img) => {
  EXIF.getData(img, function () {
    const altitude = EXIF.getTag(this, "GPSAltitude").valueOf();
    const direction = EXIF.getTag(this, "GPSImgDirection").valueOf();
    const latitude = numeratorToLatLng(EXIF.getTag(this, "GPSLatitude"));
    const longitude = numeratorToLatLng(EXIF.getTag(this, "GPSLongitude"));

    if (map) {
      console.log("Setting map to ", {
        altitude,
        direction,
        latitude,
        longitude,
      });
      map.setView(L.latLng(latitude, longitude), 14);
    } else {
      console.warn("Map not initialized");
    }
  });
};

const handleFile = (e?: Event) => {
  if (!e) {
    return;
  }
  const file = e?.target?.files?.[0] ?? null;

  if (!file) {
    return;
  }

  const img = document.createElement("img");
  img.classList.add("img-fluid", "photo-preview", "js-photo-preview-image");
  img.file = file;
  // $previewElement.replaceChildren(img);

  reader.onload = ((preview) => (e) => {
    preview.src = e?.target?.result ?? "";

    setTimeout(() => {
      processExif(img);
      drawCanvasImage(img);
      drawCanvasMap();
    }, 100);

    setTimeout(() => {
      prepareDownload();
    }, 2000);
  })(img);

  reader.readAsDataURL(file);
};

window.addEventListener("load", function () {
  const $photoInput = document.getElementById("js-photo-source");
  const $preview = document.getElementById("js-photo-preview-container");
  const $photoData = document.getElementById("js-photo-map");

  if (!$photoData || !$photoInput || !$preview) {
    console.warn("Missing elements");
    return;
  }

  $photoInput.addEventListener("change", handleFile, false);

  map = L.map($photoData).setView([54.37933333, 18.40696389], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // console.log("Map initialized", leafletImage);
});
