import { MapPosition } from "@app-types/Map.type.ts";
import { type Message, MessageState } from "@app-types/Message.type.ts";
import { MapOptions } from "@components/Mapa/MapOptions.tsx";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";
import { fault, log } from "@utils/console.ts";
import { markerIcon } from "@utils/marker.ts";
import type { Map as LeafLetMap, Marker } from "leaflet";
import * as L from "leaflet";
// @ts-expect-error
import leafletImage from "leaflet-image";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CENTER: [number, number] = [54.403397, 18.570665];
const DEFAULT_ZOOM: number = 14;

export const Mapa = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { notify, registerListener } = useMessageBroker();
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapParentRef = useRef<HTMLDivElement | null>(null);
  const mapa = useRef<LeafLetMap>(null);
  const marker = useRef<Marker>(null);

  const resizeMap = useCallback((size: string) => {
    log(size);
    mapElementRef.current?.classList.remove(
      "map__canvas--small",
      "map__canvas--medium",
      "map__canvas--large",
    );
    mapElementRef.current?.classList.add(size);
  }, []);

  const moveMap = useCallback((position: MapPosition) => {
    mapParentRef.current?.classList.remove(
      MapPosition.TOP_LEFT,
      MapPosition.TOP_RIGHT,
      MapPosition.BOTTOM_LEFT,
      MapPosition.BOTTOM_RIGHT,
      MapPosition.CENTER,
    );
    mapParentRef.current?.classList.add(position);
  }, []);

  const drawCanvasMap = useCallback(
    (position: MapPosition) => {
      leafletImage(mapa.current, (err: Error, canvas: HTMLCanvasElement) => {
        // TODO deal with error
        log(err);
        const img = document.createElement("img");
        const dimensions = mapa.current!.getSize();

        img.width = dimensions.x;
        img.height = dimensions.y;
        img.src = canvas.toDataURL();
        img.onload = () => {
          log("image is now ready");
          notify({
            state: MessageState.MapImageReady,
            data: { image: img, position: position },
          });
          setVisible(false);
        };
        img.onerror = (e) => {
          fault("MAP image is not ready", e);
        };
      });
    },
    [notify],
  );

  const listener = useCallback(
    (message: Message) => {
      if (message.state === MessageState.ExifMissing) {
        marker.current?.setIcon(
          L.icon({
            iconUrl: markerIcon(null),
            iconSize: [64, 64], // size of the icon
            iconAnchor: [32, 16], // point of the icon which will correspond to marker's location
          }),
        );
        // this.show({ title: true });
        setVisible(true);
      }
      if (message.state === MessageState.ExifReady) {
        setVisible(true);
        const { lat, lng, dir } = message.data as {
          lat: number;
          lng: number;
          dir: number;
        };
        log("Sett coordinates map to ", { lat, lng, dir });
        mapa.current!.setView(L.latLng(lat, lng), DEFAULT_ZOOM);
        marker.current!.setLatLng(L.latLng(lat, lng));
        marker.current!.setIcon(
          L.icon({
            iconUrl: markerIcon(dir),
            iconSize: [64, 64], // size of the icon
            iconAnchor: [32, 32], // point of the icon which will correspond to marker's location
          }),
        );
      }

      if (message.state === MessageState.ResizeMap) {
        resizeMap(message.data);
      }

      if (message.state === MessageState.MoveMap) {
        moveMap(message.data);
      }

      if (message.state === MessageState.MapSetupReady) {
        if (marker.current) {
          mapa.current?.setView(marker.current.getLatLng());
          drawCanvasMap(MapPosition.CENTER);
        }
      }

      if (message.state === MessageState.Reset) {
        mapa.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        resizeMap("map__canvas--medium");
        moveMap(MapPosition.CENTER);
        marker.current?.setLatLng(mapa.current!.getCenter());
        setVisible(false);
      }
    },
    [drawCanvasMap, moveMap, resizeMap],
  );

  useEffect(() => {
    if (!mapElementRef.current) return;

    mapa.current = L.map(mapElementRef.current, {
      center: [54.4, 18.57],
      zoom: 14,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapa.current);

    marker.current = L.marker(mapa.current.getCenter(), {
      title: "Drag to change location",
      draggable: true,
      autoPan: true,
    }).addTo(mapa.current);

    return () => {
      mapa.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    requestAnimationFrame(() => {
      mapa.current?.invalidateSize();
    });
  }, [visible]);

  useEffect(() => {
    return registerListener(listener, "Mapa");
  }, [registerListener, listener]);

  return (
    <aside
      className="map map--center"
      style={{ display: visible ? "block" : "none" }}
      ref={mapParentRef}
    >
      <div className="map__canvas map__canvas--medium" ref={mapElementRef} />
      <div className="map__title map__title--hidden">
        Unable to read <abbr title="Exchangeable Image File Format">EXIF</abbr>{" "}
        data from the photo. Drag the marker to set{" "}
        <abbr title="Global Positioning System">GPS</abbr> position manually, or{" "}
        <button type="button" className="reset">
          load another photo
        </button>
        .
      </div>
      <MapOptions />
    </aside>
  );
};
