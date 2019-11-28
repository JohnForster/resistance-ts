import React, { PureComponent, Fragment } from 'react';
import * as Styled from './styled';

const Background = ({ children }: { children: JSX.Element[] | JSX.Element }): JSX.Element => (
  <Styled.BackgroundImage>
    <Styled.Blur>{children}</Styled.Blur>
  </Styled.BackgroundImage>
);

export default Background;
