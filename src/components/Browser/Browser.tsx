import { Message, MessageState } from "../../lib/MessageBroker/Message.type.ts";
import { type ChangeEvent, useCallback, useState } from "react";
import { usePublish, useSubscribe } from "../../lib/MessageBroker/useMessageBroker.ts";
import { Listener } from "../../lib/MessageBroker/Publisher.class.ts";



export const Browser = () => {
  const [visible, setVisible] = useState<boolean>(true);
    const publish = usePublish();

  const listener = useCallback<Listener>((message: Message) => {
      console.log("Browser listener", message);
    if (message.state === MessageState.Reset) {
      setVisible(true);
    }
  }, []);

  useSubscribe(listener); //FIXME - check how many times this is called, it should be only once

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      publish({ state: MessageState.FileChange, data: event.nativeEvent });
      setVisible(false);
    },
    [publish],
  );

    console.log("Browser render, visible:", visible);

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
