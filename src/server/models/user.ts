import WebSocket from 'ws';
import generateID from '../utils/generateID';
import Game from './game';
import { PlayerDataEvent } from '../../shared/types/eventTypes';

export default class User {
  public id: string;
  public ws: WebSocket;
  public ip: string;
  public game: Game;
  public name: string;

  constructor(ws: WebSocket, ip: string) {
    this.ws = ws;
    this.ip = ip;
    this.id = generateID().toLowerCase();
  }

  sendPlayerData = (): void => {
    const payload: PlayerDataEvent = {
      event: 'playerData',
      data: {
        playerID: this.id,
        name: this.name,
      },
    };
    this.ws.send(JSON.stringify(payload));
  };
}
