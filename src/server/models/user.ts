import WebSocket from 'ws';
import { EventByName, EventType, WSEvent } from '@shared/types/eventTypes';
import { v4 as uuidv4 } from 'uuid';

export default class User {
  public id: string = uuidv4();
  public gameID: string;
  public name: string;

  constructor(public ws: WebSocket) {}

  public sendPlayerData = (): void => {
    const playerData: WSEvent = {
      event: 'playerData',
      data: {
        playerID: this.id,
        name: this.name,
      },
    };
    this.send(playerData);
  };

  public send = (payload: WSEvent): void => {
    this.ws.send(JSON.stringify(payload), (err) => {
      if (!err) return;
      console.warn(
        `Sending failed to player ${this.id.slice(0, 6)}... (${
          this.name
        }) ${err}`,
      );
    });
  };
}

// TODO: 10/12/20 This could be converted into a struct
// type User2 = {
//   id: string;
//   game: Game; // possibly gameID: string ?
//   name: string;
//   websocket: WebSocket;
// };

// const sendPayload = (user: User2, payload: WSEvent) => {};

// const sendGameUpdate = (user: User2) => {

// }

// const sendPlayerData = (user: User2) => {

// }
