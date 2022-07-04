import styled from 'styled-components';

export const MessagesList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    min-height: 1px;
`;

export const ListWrapper = styled.div`
    overflow: hidden;
    overflow-y: scroll;
    flex: 1 1 auto;
`;

export const MessageDivider = styled.hr`
    width: 100%;
    border: 0;
    border-bottom: 1px solid currentColor;
    opacity: 0.5;
    margin: 16px 0;
`;