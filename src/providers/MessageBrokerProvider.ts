import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Message, MessageListener } from "../types/Message.type.ts";

export type MessageBrokerContextValue = {
  subscribe: (listener: MessageListener) => void;
  unsubscribe: (listener: MessageListener) => void;
  notify: (message: Message) => void;
};

const MessageBrokerContext = createContext<MessageBrokerContextValue>({
  subscribe: (_listener: MessageListener) => {
    throw new Error("subscribe is not implemented yet.");
  },
  unsubscribe: (_listener: MessageListener) => {
    throw new Error("unsubscribe is not implemented yet.");
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
  const [subscribers, setSubscribers] = useState<MessageListener[]>([]);

  const subscribe = useCallback((_listener: MessageListener): void => {
    setSubscribers((prevSubscribers) => [...prevSubscribers, _listener]);
  }, []);

  const unsubscribe = useCallback((_listener: MessageListener): void => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((listener) => listener !== _listener),
    );
  }, []);

  const notify = useCallback(
    (_message: Message): void => {
      console.log("Notify listeners: ", _message.state);
      subscribers.forEach((listener) => {
        listener(_message);
      });
    },
    [subscribers],
  );

  return createElement(
    MessageBrokerContext.Provider,
    { value: { subscribe, unsubscribe, notify } },
    children,
  );
};

export const useMessageBroker = ({
  listener,
}: {
  listener?: MessageListener;
}): MessageBrokerContextValue => {
  const context = useContext(MessageBrokerContext);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <I know better>
  useEffect(() => {
    if (listener) {
      context.subscribe(listener);
      return () => {
        context.unsubscribe(listener);
      };
    }
  }, [context.subscribe, context.unsubscribe]);
  return context;
};
