import { useCallback, useEffect, useRef } from "react";
import type { Message } from "./Message.type.ts";
import {Listener, Publisher} from "./Publisher.class.ts";

const publisher = new Publisher();

const usePublisher = () => {
  const publisherRef = useRef<Publisher>(publisher);
  return publisherRef.current;
};

export const useSubscribe = (observer: Listener) => {
  const publisher = usePublisher();

  useEffect(() => {
    const unsubscribe = publisher.subscribe(observer);
    return () => {
      unsubscribe();
    };
  }, [observer, publisher.subscribe]);
};

export const usePublish = () => {
  const publisher = usePublisher();

  return useCallback(
    (message: Message) => {
      publisher.publish(message);
    },
    [publisher.publish],
  );
};
