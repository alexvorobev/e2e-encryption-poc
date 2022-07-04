import { useCallback, useEffect, useState } from "react";
import { nanoid } from 'nanoid';

import { useMessagesContext } from "../../../providers/MessagesProvider";
import arrayBufferToBase64 from "../../../utils/arrayBufferToBase64";
import base64ToArrayBuffer from "../../../utils/base64ToArrayBuffer";

const useEncryptedMessages = ({
    userId,
    participantKey,
    privateKey,
}) => {
    const { messages, pushMessage } = useMessagesContext()
    const [chatHistory, setChatHistory] = useState([]);

    const sendEncryptedMessage = useCallback((message) => {
        let enc = new TextEncoder();
        
        window.crypto.subtle.encrypt(
            {
              name: "RSA-OAEP"
            },
            participantKey,
            enc.encode(message),
          ).then(e => {
            const message = arrayBufferToBase64(e);
            
            pushMessage({
                id: nanoid(),
                message,
                sender: userId,
            })
        })
    }, [participantKey, pushMessage, userId])

    const decryptMessage = useCallback(async (message) => {
        const decoder = new TextDecoder();

        return await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            base64ToArrayBuffer(message),
        ).then(e => {
            return decoder.decode(e)
        })
    }, [privateKey])

    useEffect(() => {
        Promise.all(messages.map(async (message) => {
            if(message.sender !== userId) {
                const decryptedMessage = await decryptMessage(message.message)

                return {
                    ...message,
                    decrypted: decryptedMessage,
                }
            }

            return message
        })).then(decryptedMessagesResult => {
            setChatHistory(decryptedMessagesResult);
        })

    }, [messages, userId, decryptMessage])

    // useEffect(() => {
    //     let enc = new TextEncoder();
    //     let dec = new TextDecoder();

    //     window.crypto.subtle.encrypt(
    //         {
    //             name: "RSA-OAEP"
    //           },
    //           participantKey,
    //           enc.encode('hey'),
    //     ).then(e => {
    //         const encryptedString = arrayBufferToBase64(e)
    //         const arrayEncrypted = base64ToArrayBuffer(encryptedString)

    //         window.crypto.subtle.decrypt(
    //             {
    //                 name: "RSA-OAEP"
    //             },
    //             privateKey,
    //             arrayEncrypted,
    //         ).then(de => {
    //             const messEncoded = dec.decode(de);
    //             console.log('decrypted', messEncoded);
    //         })
    //     })
    // }, [participantKey, privateKey])

    return {
        sendEncryptedMessage,
        chatHistory
    }
}

export default useEncryptedMessages;