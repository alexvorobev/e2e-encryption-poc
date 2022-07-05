import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100%;
  gap: 32px;
  width: 100%;
  padding: 0 60px;
  box-sizing: border-box;
  flex: 1 1 100%;
  max-height: 100%;
  min-height: 1px;
  overflow: hidden;
`;

export default Container;
