import type { Message, MessageListener } from "@app-types/Message.type.ts";
import { log } from "@utils/console.ts";
import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

export type MessageBrokerContextValue = {
  registerListener: (
    listener: MessageListener,
    listenerName: string,
  ) => () => void;
  notify: (message: Message) => void;
};

const MessageBrokerContext = createContext<MessageBrokerContextValue>({
  registerListener: (_listener: MessageListener, _listenerName: string) => {
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
    (
      _listener: MessageListener,
      listenerName: string = "Unknown",
    ): (() => void) => {
      log("REGISTER LISTENER: ", listenerName);

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
  listenerName,
}: {
  listener?: MessageListener;
  listenerName?: string;
} = {}): MessageBrokerContextValue => {
  const context = useContext(MessageBrokerContext);

  // MessageBrokerProvider.ts
  useEffect(() => {
    if (listener == null) return;
    return context.registerListener(listener, listenerName ?? "Unknown");
  }, [context.registerListener, listener, listenerName]);

  return context;
};
