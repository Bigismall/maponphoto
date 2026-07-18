import { type Message, MessageState } from "@app-types/Message.type.ts";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";
import { type ChangeEvent, useCallback, useState } from "react";

export const PhotoBrowser = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const { notify, registerListener } = useMessageBroker();

  const listener = useCallback((message: Message) => {
    if (message.state === MessageState.Reset) {
      setVisible(true);
    }
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      notify({ state: MessageState.FileChange, data: event.nativeEvent });
      setVisible(false);
    },
    [notify],
  );

  registerListener(listener);

  if (!visible) {
    return null;
  }

  return (
    <aside className="browser">
      <input
        accept="image/*"
        className="browser__input"
        id="js-browser-input"
        name="photo-source"
        onChange={handleChange}
        type="file"
        multiple
      />
      <label htmlFor="js-browser-input">Select images</label>
    </aside>
  );
};
