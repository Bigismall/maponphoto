import { type Message, MessageState } from "@app-types/Message.type.ts";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";
import { type ChangeEvent, useCallback, useState } from "react";

export const PhotoBrowser = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const { notify } = useMessageBroker({
    listener: useCallback((message: Message) => {
      if (message.state === MessageState.Reset) {
        setVisible(true);
      }
    }, []),
    listenerName: "Photo Browser",
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      notify({ state: MessageState.FileChange, data: event.nativeEvent });
      setVisible(false);
    },
    [notify],
  );

  return (
    <aside className="browser" style={{ display: visible ? "block" : "none" }}>
      <input
        accept="image/*"
        className="browser__input"
        id="browser-input"
        name="photo-source"
        onChange={handleChange}
        type="file"
        multiple
      />
      <label htmlFor="browser-input">Select images</label>
    </aside>
  );
};
