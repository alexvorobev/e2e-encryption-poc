import { useMemo } from 'react';
import { nanoid } from 'nanoid';

import Container from './components/Container';
import Encryption from './components/Encryption';
import Wrapper from './components/Wrapper';
import { MessagesProvider } from './providers/MessagesProvider';
import useGenerateKeys from './hooks/useGenerateKeys';

function App() {
  const leftChatId = useMemo(() => nanoid(), []);
  const rightChatId = useMemo(() => nanoid(), []);
  const leftChatIdKeyPair = useGenerateKeys();
  const rightChatIdKeyPair = useGenerateKeys();

  return (
    <MessagesProvider>
      <Wrapper>
        <Container>
          <Encryption id={leftChatId} keys={leftChatIdKeyPair} participantKey={rightChatIdKeyPair.publicKey} />
          <Encryption id={rightChatId} keys={rightChatIdKeyPair} participantKey={leftChatIdKeyPair.publicKey} />
        </Container>
      </Wrapper>
    </MessagesProvider>
  );
}

export default App;
