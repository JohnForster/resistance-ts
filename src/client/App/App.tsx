import React, { PureComponent, Fragment } from 'react';
import eventEmitter from '../helpers/wsEventEmitter';
import { MainPage } from './Pages';
import { MessageEvent } from '../../shared/types/eventTypes';

eventEmitter.bind('message', msg => console.log('message received: ', msg));

export default class App extends PureComponent<any, any> {
  state = { isClientOpen: false };

  handleClick = (): void => {
    eventEmitter.send<MessageEvent>('message', 'this is a message');
  };

  render(): JSX.Element {
    return (
      <Fragment>
        {`isClientOpen: ${this.state.isClientOpen}`} <br />
        <button onClick={this.handleClick}>Send Message</button>
        <MainPage />
      </Fragment>
    );
  }
}
