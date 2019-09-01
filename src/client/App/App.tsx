import React, { PureComponent, Fragment } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://192.168.1.8:8080/echo');

export default class App extends PureComponent<any, any> {
  state = { isClientOpen: false };

  constructor(props: any) {
    super(props);
    client.onopen = (): void => {
      this.setState({ isClientOpen: true });
      console.log('client open');
    };
    client.onmessage = msg => console.log(msg.data);
  }

  handleClick = (): void => {
    client.send('Have a message!');
  };

  render(): JSX.Element {
    return (
      <Fragment>
        {`isClientOpen: ${this.state.isClientOpen}`} <br />
        <button onClick={this.handleClick}>Send Message</button>
      </Fragment>
    );
  }
}
