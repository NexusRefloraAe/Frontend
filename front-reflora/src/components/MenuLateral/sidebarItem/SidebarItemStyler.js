import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  
  font-size: 17px;
  color: white;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  margin: 0 0px 20px;

  @media (max-width: 480px) {
  font-size: 15px;
  
  }
  @media (max-width: 1024px) {
    font-size: 15px;
  }

  > svg {
    margin: 0 20px;
  }

  &:hover {
    background-color: ${({ isLogout }) => (isLogout ? '#8B0000' : '#1C8A1A')}
  }
`;