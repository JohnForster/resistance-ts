import React, { PureComponent, Fragment } from 'react';
import eventEmitter from '../helpers/wsEventEmitter';
import { MainPage } from './Pages';
import { MessageEvent, GameCreatedEvent } from '../../shared/types/eventTypes';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

eventEmitter.bind('message', msg => console.log('message received: ', msg));
eventEmitter.bind('error', msg => console.error('error received: ', msg));

interface AppState {
  game: any;
}

export default class App extends PureComponent<any, AppState> {
  state: AppState = {
    game: null,
  };

  constructor(props: any) {
    super(props);
    eventEmitter.bind('game_created', this.hostGame);
  }

  hostGame = (data: GameCreatedEvent): void => {
    console.log(data);
  };

  render(): JSX.Element {
    return (
      <Router>
        Is this working?
        <Route
          path="/"
          exact
          render={(): JSX.Element => <MainPage eventEmitter={eventEmitter} game={this.state.game} />}
        />
      </Router>
    );
  }
}
