import { createContext, useCallback, useContext, useState } from 'react';

const MessagesContext = createContext({
  messages: [],
  pushMessage: () => {},
});

export function useMessagesContext() {
  return useContext(MessagesContext);
}

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const pushMessage = useCallback(
    (message) => {
      setMessages([...messages, message]);
    },
    [messages],
  );

  return <MessagesContext.Provider value={{ messages, pushMessage }}>{children}</MessagesContext.Provider>;
};

export default MessagesContext;
