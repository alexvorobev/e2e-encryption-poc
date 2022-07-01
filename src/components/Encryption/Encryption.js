import { Button, Pane, Text, TextInputField } from "evergreen-ui";
import { nanoid } from 'nanoid';
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMessagesContext } from "../../providers/MessagesProvider";

import Message from "../Message";
import { MessagesList } from "./styles";

const Encryption = ({id}) => {
    const { register, handleSubmit, reset } = useForm();
    const { messages, pushMessage } = useMessagesContext()
    
    const onSubmitHandler = useCallback(({messageText}) => {
        pushMessage({
            id: nanoid(),
            message: messageText,
            sender: id,
        })
        reset();
    }, [id, pushMessage, reset])

    return (
        <Pane padding={32} display="flex" flexDirection="column" border="default" borderRadius={12}>
            <Text size={900} marginBottom={32} fontWeight='bold'>{id}</Text>
            <MessagesList>
                {
                    messages.map(({id: messageId, message, sender}) => (<Message key={messageId} type={sender !== id ? 'received' : 'sent'}>{message}</Message>))
                }
            </MessagesList>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Pane display="flex" alignItems="center" gap={16}>
                        <TextInputField placeholder="Message..." flex="1 1 100%" marginBottom={8} {...register('messageText')}/>
                        <Button appearance="primary">Send</Button>
                </Pane>
            </form>
        </Pane>
    )
};

export default Encryption;