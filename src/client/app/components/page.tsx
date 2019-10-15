import React, { PureComponent } from 'react';
import * as Styled from './styled';

export interface PageProps {}

interface PageState {}

export default class Page extends PureComponent<PageProps, PageState> {
  render(): JSX.Element {
    return (
      <Styled.PageContainer>
        <h1>Stop Being A Perfectionist</h1>
        {this.props.children}
      </Styled.PageContainer>
    );
  }
}
