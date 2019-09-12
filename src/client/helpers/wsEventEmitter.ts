import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { WSEvent, Callbacks, Callback } from '../../shared/types/eventTypes';

export default class WSEventEmitter {
  private websocket: W3CWebSocket;
  private callbacks: Callbacks = {};

  constructor(url: string) {
    this.websocket = new W3CWebSocket(url);
    this.websocket.onclose = (): void => this.execute('close', null);
    this.websocket.onopen = (): void => this.execute('open', null);
    this.websocket.onmessage = this.onMessage;
  }

  public send = <T extends WSEvent>(eventType: T['event'], data: T['data']): WSEventEmitter => {
    const payload = JSON.stringify([eventType, data]);
    this.websocket.send(payload);
    return this;
  };

  public bind = <T extends WSEvent>(eventType: T['event'], cb: Callback<T>): WSEventEmitter => {
    if (!this.callbacks[eventType]) this.callbacks[eventType] = [];
    this.callbacks[eventType].push(cb);
    return this;
  };

  private onMessage = (evt: { data: string }): void => {
    const json: WSEvent = JSON.parse(evt.data);
    console.log('Websocket recieved:', json);
    this.execute(json.event, json.data);
  };

  private execute = <T extends WSEvent>(eventName: T['event'], data: T['data']): void => {
    const chain: Callback<T>[] = this.callbacks[eventName] || [];
    chain.forEach(cb => cb(data));
  };
}
