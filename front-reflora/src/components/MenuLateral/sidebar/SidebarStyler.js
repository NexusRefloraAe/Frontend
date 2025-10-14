import styled from "styled-components";

export const Container = styled.div`
  background-color: #257024;
  position: fixed;
  height: 100vh;
  top: 0;
  left: ${(props) => (props.sidebar ? "0" : "-100%")};
  width: 17vw;
  transition: left 0.3s ease-in-out;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);

  ${(props) =>
    props.fixed &&
    `
    left: 0;
    transition: none;
  `}

  @media (max-width: 1024px) {
    width: 22vw;
    height: 100vh;
  }
    @media (max-width: 480px) {
    width: 50vw;
    height: 100vh;
    position: flex;
  }

  > svg {
    color: white;
    width: 30px;
    height: 30px;
    margin: 20px;
    cursor: pointer;
  }
    
  }
    
`;

export const Content = styled.div`
  margin-top: 25px;


`;

export const MenuToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  margin: 25px;

  span {
    font-weight: bold;
    font-size: 28px;
  }

  @media (max-width: 1024px) {
    span {
      font-size: 18px;
    }
  }
`;
