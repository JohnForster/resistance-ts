import WebSocket from 'ws';
import Game from './game/game';
import { EventByName, WSEvent } from '@shared/types/eventTypes';
import { EventType } from '@server/types/enums';
import uuidv4 from 'uuid/v4';

export default class User {
  public id: string = uuidv4();
  public game: Game;
  public name: string;

  constructor(public ws: WebSocket) {}

  public sendPlayerData = (): void => {
    const payload: EventByName<typeof EventType.playerData> = {
      event: EventType.playerData,
      data: {
        playerID: this.id,
        name: this.name,
      },
    };
    this.send(payload);
  };

  public send = (payload: WSEvent): void => {
    this.ws.send(JSON.stringify(payload), err => {
      if (!err) return;
      console.warn(`Sending failed to player ${this.id.slice(0, 6)}... (${this.name}) ${err}`);
    });
  };

  public sendGameUpdate = (): void => {
    this.game.sendGameUpdate(this);
  };
}
