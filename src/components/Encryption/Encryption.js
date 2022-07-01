import { Button, Pane, Text, TextInputField } from "evergreen-ui";
import Message from "../Message";
import { MessagesList } from "./styles";

const Encryption = ({id}) => {
    return (
        <Pane padding={32} display="flex" flexDirection="column" border="default" borderRadius={12}>
            <Text size={900} marginBottom={32} fontWeight='bold'>{id}</Text>
            <MessagesList>
                <Message type='sent'/>
                <Message />
            </MessagesList>
            <Pane display="flex" alignItems="center" gap={16}>
                <TextInputField placeholder="Message..." flex="1 1 100%" marginBottom={8} />
                <Button appearance="primary">Send</Button>
            </Pane>
        </Pane>
    )
};

export default Encryption;