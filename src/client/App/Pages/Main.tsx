import React, { PureComponent, Fragment } from 'react';

export interface MainPageProps {}

interface MainPageState {}

export class MainPage extends PureComponent<MainPageProps, MainPageState> {
  render(): JSX.Element {
    return (
      <div>
        The Resistance
        <br />
        <button>Host</button>
        <br />
        <button>Join</button>
      </div>
    );
  }
}
