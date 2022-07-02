import { Button, Pane, Text, TextInputField } from "evergreen-ui";
import { nanoid } from 'nanoid';
import { useCallback, useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMessagesContext } from "../../providers/MessagesProvider";

import Message from "../Message";
import { MessagesList } from "./styles";

function base64ToArrayBuffer(b64) {
    var byteString = window.atob(b64);
    var byteArray = new Uint8Array(byteString.length);
    for(var i=0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    return byteArray;
}
function pemToArrayBuffer(pem) {
    return base64ToArrayBuffer(pem);
}

function arrayBufferToBase64(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = '';
    for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    var b64 = window.btoa(byteString);

    return b64;
}

const Encryption = ({id, keys, participantKey}) => {
    const { register, handleSubmit, reset } = useForm();
    const { messages, pushMessage } = useMessagesContext()
    const [privateKeyCrypto, setPrivateKeyCrypto] = useState(null);
    const [publicKeyCrypto, setPublicKeyCrypto] = useState(null);
    const [participantPublicKeyCrypto, setParticipantPublicKeyCrypto] = useState(null);

    useEffect(() => {
        if(keys && participantKey) {
            const {privateKey, publicKey} = keys;
            const binaryPublicKey = pemToArrayBuffer(publicKey);
            const binaryParticipantPublicKey = pemToArrayBuffer(participantKey);
    
            window.crypto.subtle.importKey(
                "pkcs8",
                pemToArrayBuffer(privateKey),
                {
                    name: "RSA-OAEP",
                    hash: {name: "SHA-256"}
                },
                true,
                ["decrypt"]
            ).then(function(importedPrivateKey) {
                console.log({importedPrivateKey})
                setPrivateKeyCrypto(importedPrivateKey)
            })

            window.crypto.subtle.importKey(
                "spki",
                binaryPublicKey,
                {
                  name: "RSA-OAEP",
                  hash: "SHA-256"
                },
                true,
                ["encrypt"]
              ).then(function(importedPublicKey) {
                console.log({importedPublicKey})
                setPublicKeyCrypto(importedPublicKey)
            })

            window.crypto.subtle.importKey(
                "spki",
                binaryParticipantPublicKey,
                {
                  name: "RSA-OAEP",
                  hash: "SHA-256"
                },
                true,
                ["encrypt"]
              ).then(function(importedParticipantPublicKey) {
                console.log({importedParticipantPublicKey})
                setParticipantPublicKeyCrypto(importedParticipantPublicKey)
            })
        }
    }, [keys, participantKey])
    
    const onSubmitHandler = useCallback(({messageText}) => {
        let enc = new TextEncoder();
        
        window.crypto.subtle.encrypt(
            {
              name: "RSA-OAEP"
            },
            participantPublicKeyCrypto,
            enc.encode(messageText),
          ).then(e => {
            const message = arrayBufferToBase64(e);
            
            pushMessage({
                id: nanoid(),
                message,
                sender: id,
            })
            reset();
        });
    }, [id, participantPublicKeyCrypto, pushMessage, reset])

    return (
        <Pane padding={32} display="flex" minWidth={1} flexDirection="column" border="default" borderRadius={12}>
            <Text size="large" marginBottom={32} fontWeight='bold'>{id}</Text>
            <MessagesList>
                {
                    messages.map(({id: messageId, message, sender}) => (<Message key={messageId} type={sender !== id ? 'received' : 'sent'}>{message}</Message>))
                }
            </MessagesList>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Pane display="flex" alignItems="center" gap={16}>
                        <TextInputField label='' placeholder="Message..." flex="1 1 100%" marginBottom={8} {...register('messageText')}/>
                        <Button appearance="primary">Send</Button>
                </Pane>
            </form>
        </Pane>
    )
};

export default Encryption;