import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import type { Message, MessageListener } from "../types/Message.type.ts";
import { log } from "../utils/console.ts";

export type MessageBrokerContextValue = {
  registerListener: (listener: MessageListener) => () => void;
  notify: (message: Message) => void;
};

const MessageBrokerContext = createContext<MessageBrokerContextValue>({
  registerListener: (_listener: MessageListener) => {
    throw new Error("registerListener is not implemented yet.");
  },
  notify: (_message: Message) => {
    throw new Error("notify is not implemented yet.");
  },
});

type MessageBrokerProviderProps = {
  children: ReactNode;
};

export const MessageBrokerProvider = ({
  children,
}: MessageBrokerProviderProps) => {
  const subscribersRef = useRef<MessageListener[]>([]);

  const subscribe = useCallback((_listener: MessageListener): void => {
    subscribersRef.current = subscribersRef.current.includes(_listener)
      ? subscribersRef.current
      : [...subscribersRef.current, _listener];
  }, []);

  const unsubscribe = useCallback((_listener: MessageListener): void => {
    subscribersRef.current = subscribersRef.current.filter(
      (listener) => listener !== _listener,
    );
  }, []);

  const registerListener = useCallback(
    (_listener: MessageListener): (() => void) => {
      log("registerListener");

      subscribe(_listener);
      return () => {
        unsubscribe(_listener);
      };
    },
    [subscribe, unsubscribe],
  );

  const notify = useCallback((_message: Message): void => {
    console.log("Notify listeners: ", _message.state);
    subscribersRef.current.forEach((listener) => {
      listener(_message);
    });
  }, []);

  return createElement(
    MessageBrokerContext.Provider,
    { value: { registerListener, notify } },
    children,
  );
};

export const useMessageBroker = ({
  listener,
}: {
  listener?: MessageListener;
} = {}): MessageBrokerContextValue => {
  const context = useContext(MessageBrokerContext);

  useEffect(() => {
    if (listener == null) {
      return;
    }
    return context.registerListener(listener);
  }, [context.registerListener, listener]);

  return context;
};
