import WebSocket from 'ws';
import Game from './game/game';
import { EventByName, WSEvent, EventType } from '@shared/types/eventTypes';
import uuidv4 from 'uuid/v4';

export default class User {
  public id: string;
  public ws: WebSocket;
  public game: Game;
  public name: string;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.id = uuidv4();
  }

  public sendPlayerData = (): void => {
    const payload: EventByName<EventType.playerData> = {
      event: EventType.playerData,
      data: {
        playerID: this.id,
        name: this.name,
      },
    };
    this.send(payload);
  };

  public send = (payload: WSEvent): void => {
    this.ws.send(JSON.stringify(payload));
  };
}
