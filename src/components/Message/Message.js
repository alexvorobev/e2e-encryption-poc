import { Pane, useTheme } from "evergreen-ui"

const Message = ({type}) => {
    const isSent = type === "sent";
    const { colors } = useTheme()

    return <Pane display='flex' justifyContent={isSent ? 'flex-end' : 'flex-start'} marginBottom={16}>
        <Pane width='65%' padding={16} borderRadius={8} backgroundColor={isSent ? colors.blue500 : 'transparent'} border={isSent ? 'none' : 'default'} color={isSent ? colors.white : colors.default}>
            Message {isSent ? 'sent' : 'received'}
        </Pane>
    </Pane>
}

export default Message;