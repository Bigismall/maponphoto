import "leaflet/dist/leaflet.css";
import "./styles/styles.scss";
import { createRoot } from "react-dom/client";
import App from "./App";
import { MessageBrokerProvider } from "./providers/MessageBrokerProvider.ts";

const rootElement = document.querySelector("#root");

if (rootElement) {
  createRoot(rootElement).render(
    <MessageBrokerProvider>
      <App />
    </MessageBrokerProvider>,
  );
}
