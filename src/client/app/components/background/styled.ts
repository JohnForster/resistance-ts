import styled from 'styled-components';

export const BackgroundImage = styled.div`
  background-image: url(/assets/bg.jpg);
  background-position: right center;
  background-size: auto 100%;
  height: 100vh;
`;

export const Blur = styled.div`
  backdrop-filter: blur(10px) brightness(0.9);
  height: 100%;
`;
