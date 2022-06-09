import "../styles/styles.scss";

import * as EXIF from "exif-js";
import * as L from "leaflet";

let map: L.Map;
let reader = new FileReader();

const numeratorToLatLng = (numerator: [Number, Number, Number]): number =>
  numerator[0].valueOf() +
  numerator[1].valueOf() / 60 +
  numerator[2].valueOf() / 3600;

const processExif = () => {
  EXIF.getData(document.querySelector(".js-photo-preview-image"), function () {
    console.log("GPSLatitude: ", EXIF.getTag(this, "GPSLatitude"));

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

const handleFile = ($previewElement: HTMLImageElement) => (e?: Event) => {
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
  $previewElement.replaceChildren();
  $previewElement.appendChild(img);

  reader.onload = ((preview) => (e) => {
    preview.src = e?.target?.result ?? "";

    setTimeout(() => {
      processExif();
    }, 100);
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

  $photoInput.addEventListener(
    "change",
    handleFile($preview as HTMLImageElement),
    false
  );

  map = L.map($photoData).setView([54.37933333, 18.40696389], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
});
