import React, { PureComponent, Fragment } from 'react';
import { WSEventEmitter } from '../../helpers/wsEventEmitter';
import { MessageEvent, CreateEvent } from '../../../shared/types/eventTypes';

export interface MainPageProps {
  eventEmitter: WSEventEmitter;
  game: any;
}

interface MainPageState {}

export class MainPage extends PureComponent<MainPageProps, MainPageState> {
  handleClick = (): void => {
    this.props.eventEmitter.send<MessageEvent>('message', 'this is a message');
  };

  host = (): void => {
    // ? Data to send with create Event?
    this.props.eventEmitter.send<CreateEvent>('create_game', {});
  };

  render(): JSX.Element {
    return (
      <div>
        <button onClick={this.handleClick}>Send Message</button>
        The Resistance
        <br />
        <button onClick={this.host}>Host</button>
        <br />
        <button>Join</button>
      </div>
    );
  }
}
