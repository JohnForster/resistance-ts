import uuidv4 from 'uuid/v4';
import WebSocket from 'ws';

export default class User {
  public id: string;
  public ws: WebSocket;
  private ip: string;

  constructor(ws: WebSocket, ip: string) {
    this.ws = ws;
    this.ip = ip;
    this.id = uuidv4();
  }

  get shortID(): string {
    return this.id.slice(0, 5);
  }
}
