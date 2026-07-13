import "leaflet/dist/leaflet.css";
import "./styles/styles.scss";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.querySelector("#root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
