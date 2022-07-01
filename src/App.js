import { nanoid } from 'nanoid'
import { useMemo } from 'react';

import Container from "./components/Container";
import Encryption from "./components/Encryption";
import Wrapper from "./components/Wrapper";
import { MessagesProvider } from './providers/MessagesProvider';

function App() {
  const leftChatId = useMemo(() => nanoid(), []);
  const rightChatId = useMemo(() => nanoid(), []);

  return (
    <MessagesProvider>
      <Wrapper>
        <Container>
          <Encryption id={leftChatId} />
          <Encryption id={rightChatId} />
        </Container>
      </Wrapper>
    </MessagesProvider>
  );
}

export default App;
