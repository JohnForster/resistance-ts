import React, { PureComponent, Fragment } from 'react';

export interface JoinPageProps {
  joinGame: (id: string) => void;
}

interface JoinPageState {}

export default class JoinPage extends PureComponent<JoinPageProps, JoinPageState> {
  render(): JSX.Element {
    return <Fragment></Fragment>;
  }
}
