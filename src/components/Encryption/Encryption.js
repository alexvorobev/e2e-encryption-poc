import { useCallback, useEffect, useRef } from 'react';
import { Button, Pane, Text, TextInputField } from 'evergreen-ui';
import { useForm } from 'react-hook-form';

import Message from '../Message';
import useEncryptedMessages from './hooks/useEncryptedMessages';
import useKeys from './hooks/useKeys';
import { ListWrapper, MessagesList, MessageDivider } from './styles';

const Encryption = ({ id, keys, participantKey: participantKeySource }) => {
  const { register, handleSubmit, reset } = useForm();
  const listRef = useRef(null);
  const { privateKey, participantKey } = useKeys({ ...keys, participantKey: participantKeySource });
  const { chatHistory, sendEncryptedMessage } = useEncryptedMessages({
    userId: id,
    participantKey,
    privateKey,
  });

  const onSubmitHandler = useCallback(
    ({ messageText }) => {
      if (messageText) {
        reset();
        sendEncryptedMessage(messageText);
      }
    },
    [reset, sendEncryptedMessage],
  );

  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <Pane
      padding={32}
      display='flex'
      minWidth={1}
      flexDirection='column'
      border='default'
      borderRadius={12}
      maxHeight='100%'
    >
      <Text size='large' marginBottom={32} fontWeight='bold'>
        {id}
      </Text>
      <ListWrapper ref={listRef}>
        <MessagesList>
          {chatHistory.map(({ id: messageId, message, decrypted, sender }) => (
            <Message key={messageId} type={sender !== id ? 'received' : 'sent'}>
              <Text color='currentcolor'>{message}</Text>
              <MessageDivider />
              <Text color='currentcolor'>{decrypted}</Text>
            </Message>
          ))}
        </MessagesList>
      </ListWrapper>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Pane display='flex' alignItems='center' gap={16}>
          <TextInputField
            label=''
            placeholder='Message...'
            flex='1 1 100%'
            marginBottom={8}
            {...register('messageText')}
          />
          <Button appearance='primary'>Send</Button>
        </Pane>
      </form>
    </Pane>
  );
};

export default Encryption;
