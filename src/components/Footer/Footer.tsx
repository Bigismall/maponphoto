import pkg from "../../../package.json";

export const Footer = () => {
  const version = `v${pkg.version}`;
  return (
    <footer>
      <ul>
        <li>
          <img src="assets/favicon-32x32.png" alt="Map icon" /> Map on photo{" "}
          <span>{version}</span> - supported by:
        </li>
        <li>
          <a
            href="https://vitejs.dev"
            title="Vite Next Generation Frontend Tooling"
          >
            Vite
          </a>
        </li>
        <li>
          <a
            href="https://leafletjs.com"
            title="An open-source JavaScript library for mobile-friendly interactive maps"
          >
            Leaflet
          </a>
        </li>
        <li>
          <a
            href="https://github.com/mapbox/leaflet-image"
            title="Export images out of Leaflet maps without a server component, by using Canvas and CORS"
          >
            Leaflet-image
          </a>
        </li>
        <li>
          <a
            href="https://www.openstreetmap.org"
            title="OpenStreetMap is a map of the world, created by people like you and free to use under an open licence."
          >
            OpenStreetMap
          </a>
        </li>
        <li>
          <a
            href="https://mutiny.cz/exifr"
            title="The fastest and most versatile JavaScript EXIF reading library."
          >
            EXIFR
          </a>
        </li>
        <li>
          <a href="https://github.com" title="Where the world builds software">
            GitHub
          </a>
        </li>
        <li>
          See also{" "}
          <a
            href="https://dualmaps.eu/"
            title="Dual maps allows you to synchronize views of different map types side by side.
Compare satellite views with 3D buildings layer, railroads with Bing maps, typography and air traffic map. You decide!"
          >
            Dual Maps
          </a>
        </li>
      </ul>
    </footer>
  );
};
