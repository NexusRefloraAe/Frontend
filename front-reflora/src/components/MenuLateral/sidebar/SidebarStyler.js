import styled from 'styled-components';

export const Container = styled.div`
  background-color: #257024;
  position: fixed;
  height: 100vh;
  top: 0px;
  left: 0px;
  width: 22vw;
  left: ${props => props.sidebar ? '0' : '-100%'};
  animation: showSidebar .15s;
  transition: left 0.3s ease-in-out;

  /* Faz o menu ajustar o tamanho em telas menores */
  @media (max-width: 768px) {
    width: 50%; /* ocupa 50% da tela no mobile */
    animation: showSidebarTablet 0.15s;
  }

  @media (max-width: 480px) {
    width: 50%; /* ocupa 50% em telas muito pequenas 
    animation: showSidebarMobile 0.15s;*/
  }

  > svg {
    position: fixed;
    color: white;
    width: 30px;
    height: 30px;
    margin-top: 32px;
    margin-left: 32px;
    cursor: pointer;
  }

  @keyframes showSidebar {
    from {
      opacity: 0;
      width: 0;
    }
    to {
      opacity: 10;
      width: 300px;
       
    }
  }
    @keyframes showSidebarTablet {
    from { 
      opacity: 0; 
      width: 0; }
    to { 
      opacity: 1; 
      width: 50%; 
    }
  }

  @keyframes showSidebarMobile {
    from { 
      opacity: 0; 
      width: 0; 
    }
    to { 
      opacity: 1; 
      width: 50%; }
  }
`;

export const Content = styled.div`
  margin-top: 40px;
`;

export const MenuToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  margin: 32px;

  svg {
    color: white;
    width: 30px;
    height: 30px;
    margin-right: 50px;

    @media (max-width: 480px) {
    margin-right: 30px;
    }
  }

  span {
    font-weight: bold;
    font-size: 35px;

    @media (max-width: 480px) {
      font-size: 20px; /* reduz o texto no celular */
    }
      @media (max-width: 768px) {
      font-size: 25px; /* reduz o texto no celular */
    }
  }
`;