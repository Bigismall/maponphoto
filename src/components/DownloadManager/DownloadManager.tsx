import { type Message, MessageState } from "@app-types/Message.type.ts";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";
import { warn } from "@utils/console.ts";
import { generateFilename, isEmptyString } from "@utils/utils.ts";
import { useCallback, useMemo, useRef, useState } from "react";

export const DownloadManager = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>("");
  const canShareFiles = useMemo((): boolean => {
    return (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function"
    );
  }, []);

  const revokeBlobUrl = useCallback(async () => {
    if (isEmptyString(blobUrl)) {
      return;
    }

    URL.revokeObjectURL(blobUrl);
    setBlobUrl("");
  }, [blobUrl]);

  const clearDownloadState = useCallback(() => {
    revokeBlobUrl();
    setDownloadBlob(null);
    if (downloadRef.current) {
      downloadRef.current.removeAttribute("href");
    }
  }, [revokeBlobUrl]);

  const prepareDownload = useCallback(
    async (blob: Blob) => {
      await revokeBlobUrl();
      setDownloadBlob(blob);
      const blobUrl = URL.createObjectURL(blob);
      setBlobUrl(blobUrl);

      if (downloadRef.current) {
        downloadRef.current.setAttribute("download", generateFilename());
        downloadRef.current.setAttribute("href", blobUrl);
      }
    },
    [revokeBlobUrl],
  );

  const share = async (event: Event) => {
    event.preventDefault();

    if (!downloadBlob) {
      warn("No image ready to share");
      return;
    }

    const file = new File([downloadBlob], generateFilename(), {
      type: "image/jpeg",
    });

    if (!canShareFiles || !navigator.canShare({ files: [file] })) {
      warn("Sharing files is not supported in this browser");
      return;
    }

    try {
      await navigator.share({
        title: "See my photo with the embedded map",
        files: [file],
      });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      warn("Failed to share image");
    }
  };

  const reset = () => {
    setVisible(false);
    clearDownloadState();
    notify({ state: MessageState.Reset });
  };

  const download = async () => {
    setTimeout(() => {
      setVisible(false);
      clearDownloadState();
      notify({ state: MessageState.NextImage });
    }, 0);
  };

  const { notify } = useMessageBroker({
    listener: (message: Message) => {
      if (message.state === MessageState.CanvasWithMapReady) {
        setVisible(true);
        prepareDownload(message.data);
      }
    },
  });

  if (!visible) {
    return null;
  }
  return (
    <aside className="download">
      <a
        ref={downloadRef}
        className="download__input download__input--action"
        download
        href="about:blank"
        onClick={download}
      >
        Download image
      </a>
      {canShareFiles && (
        <button
          className="download__input download__input--share"
          type="button"
          onClick={(event) => share(event.nativeEvent)}
        >
          Share image
        </button>
      )}
      <button className="download__input" type="button" onClick={reset}>
        Try another image
      </button>
    </aside>
  );
};
