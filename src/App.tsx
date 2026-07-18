import { useEffect } from "react";
import { Canvas } from "./components/Canvas/Canvas.tsx";
import { Footer } from "./components/Footer/Footer.tsx";

import { Info } from "./components/Info/Info.tsx";
import { DownloadManager } from "./components/PhotoBrowser/DownloadManager.tsx";
import { PhotoBrowser } from "./components/PhotoBrowser/PhotoBrowser.tsx";
import { useImageManager } from "./hooks/useImageManager.ts";
export default function App() {
  useImageManager();

  useEffect(() => {
    const supportsShareFiles =
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function";

    if (!supportsShareFiles) {
      console.log("Web Share API not supported :(");
    }
  }, []);

  return (
    <>
      <main className="container">
        <Canvas />
        <Info />
        <PhotoBrowser />
        <DownloadManager />
        <aside className="map map--hidden map--center">
          <div className="map__canvas map__canvas--medium" id="js-map" />
          <div className="map__title map__title--hidden">
            Unable to read{" "}
            <abbr title="Exchangeable Image File Format">EXIF</abbr> data from
            the photo. Drag the marker to set{" "}
            <abbr title="Global Positioning System">GPS</abbr> position
            manually, or{" "}
            <button className="js-reset" type="button">
              load another photo
            </button>
            .
          </div>
          <div className="map__options" id="js-map-options">
            <fieldset>
              <legend>Map position</legend>
              <button data-position="map--topleft" type="button">
                &#11017;
              </button>
              <button data-position="map--topright" type="button">
                &#11016;
              </button>
              <button data-position="map--center" type="button">
                &#9737;
              </button>
              <button data-position="map--bottomleft" type="button">
                &#11019;
              </button>
              <button data-position="map--bottomright" type="button">
                &#11018;
              </button>
            </fieldset>
            <fieldset>
              <legend>Map size</legend>
              <button data-size="map__canvas--small" type="button">
                S
              </button>
              <button data-size="map__canvas--medium" type="button">
                M
              </button>
              <button data-size="map__canvas--large" type="button">
                L
              </button>
            </fieldset>
            <fieldset>
              <legend>Actions</legend>
              <button className="js-reset" type="button">
                Reset
              </button>
              <button
                id="js-map-options-submit"
                className="action"
                type="button"
              >
                Add map
              </button>
            </fieldset>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
}
