import styled from 'styled-components';

export const BackgroundImage = styled.div`
  background-image: url('/assets/bg.jpg');
  background-position: top center;
  background-size: cover;
  padding-bottom: 20vh;
  margin-bottom: -20vh;
`;

export const Blur = styled.div`
  backdrop-filter: blur(3px) brightness(0.9);
  height: 100%;
  padding-bottom: 20vh;
  margin-bottom: -20vh;
`;
