import { Canvas } from "@components/Canvas/Canvas.tsx";
import { DownloadManager } from "@components/DownloadManager/DownloadManager.tsx";
import { Footer } from "@components/Footer/Footer.tsx";
import { Mapa } from "@components/Mapa/Mapa.tsx";
import { PhotoBrowser } from "@components/PhotoBrowser/PhotoBrowser.tsx";
import { useExifManager } from "@hooks/useExifManager.ts";
import { useImageManager } from "@hooks/useImageManager.ts";
export default function App() {
  useImageManager();
  useExifManager();

  return (
    <>
      <main className="container">
        <Canvas />
        <PhotoBrowser />
        <DownloadManager />
        <Mapa />
      </main>
      <Footer />
    </>
  );
}
