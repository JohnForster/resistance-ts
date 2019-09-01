import React, { PureComponent, Fragment } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://127.0.0.1:8080/echo');

export default class App extends PureComponent {
  constructor(props: any) {
    super(props);
    client.onopen = (): void => {
      console.log('client open');
    };
    client.onmessage = msg => console.log(msg);
  }

  handleClick = (): void => {
    client.send('Have a message!');
  };

  render(): JSX.Element {
    return (
      <Fragment>
        <button onClick={this.handleClick}>Send Message</button>
      </Fragment>
    );
  }
}
