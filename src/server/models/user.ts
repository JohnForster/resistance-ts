import WebSocket from 'ws';
import generateID from '../utils/generateID';

export default class User {
  public id: string;
  public ws: WebSocket;
  public ip: string;

  constructor(ws: WebSocket, ip: string) {
    this.ws = ws;
    this.ip = ip;
    this.id = generateID().toLowerCase();
  }
}
