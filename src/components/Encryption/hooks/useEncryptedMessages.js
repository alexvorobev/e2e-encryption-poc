import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { useMessagesContext } from '../../../providers/MessagesProvider';
import arrayBufferToBase64 from '../../../utils/arrayBufferToBase64';
import base64ToArrayBuffer from '../../../utils/base64ToArrayBuffer';

const useEncryptedMessages = ({ userId, participantKey, privateKey }) => {
  const { messages, pushMessage } = useMessagesContext();
  const [chatHistory, setChatHistory] = useState([]);

  const sendEncryptedMessage = useCallback(
    (message) => {
      let enc = new TextEncoder();

      window.crypto.subtle
        .encrypt(
          {
            name: 'RSA-OAEP',
          },
          participantKey,
          enc.encode(message),
        )
        .then((e) => {
          const messageEncrypted = arrayBufferToBase64(e);
          const messageData = {
            id: nanoid(),
            message: messageEncrypted,
            sender: userId,
          }
          
          setChatHistory([...chatHistory, {
            ...messageData, 
            decrypted: message,
          }]);
          pushMessage(messageData);
        });
    },
    [participantKey, pushMessage, userId, chatHistory],
  );

  const decryptMessage = useCallback(
    async (message) => {
      const decoder = new TextDecoder();

      return await window.crypto.subtle
        .decrypt(
          {
            name: 'RSA-OAEP',
          },
          privateKey,
          base64ToArrayBuffer(message),
        )
        .then((e) => {
          return decoder.decode(e);
        });
    },
    [privateKey],
  );

  useEffect(() => {
    if(messages.length !== chatHistory.length){
      Promise.all(
        messages.map(async (message) => {
          const chatHistoryMessage = chatHistory.find(({ id }) => id === message.id);

          if(chatHistoryMessage && chatHistoryMessage.decrypted) {
            return chatHistoryMessage;
          }
          if (!message.decrypted) {
            const decryptedMessage = await decryptMessage(message.message);
  
            return {
              ...message,
              decrypted: decryptedMessage,
            };
          }
  
          return message;
        }),
      ).then((decryptedMessagesResult) => {
        setChatHistory(decryptedMessagesResult);
      });
    }
  }, [messages, userId, decryptMessage, chatHistory]);

  return {
    sendEncryptedMessage,
    chatHistory,
  };
};

export default useEncryptedMessages;
