import { type ChangeEvent, useCallback, useState } from "react";
import { useMessageBroker } from "../../providers/MessageBrokerProvider.ts";
import { type Message, MessageState } from "../../types/Message.type.ts";

export const PhotoBrowser = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const { notify } = useMessageBroker({
    listener: (message: Message) => {
      if (message.state === MessageState.Reset) {
        setVisible(true);
      }
    },
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      notify({ state: MessageState.FileChange, data: event.nativeEvent });
      setVisible(false);
    },
    [notify],
  );

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
