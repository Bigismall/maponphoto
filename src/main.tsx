import "leaflet/dist/leaflet.css";
import "@styles/styles.scss";
import { MessageBrokerProvider } from "@providers/MessageBrokerProvider.ts";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.querySelector("#root");

if (rootElement) {
  createRoot(rootElement).render(
    <MessageBrokerProvider>
      <App />
    </MessageBrokerProvider>,
  );
}
