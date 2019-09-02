import { w3cwebsocket as W3CWebSocket } from 'websocket';

export default class EventEmitter {
  private websocket: W3CWebSocket;
  private callbacks: { [eventType: string]: ((message?: string) => void)[] };

  constructor(url: string) {
    this.websocket = new W3CWebSocket(url);
    this.websocket.onclose = (): void => this.dispatch('close', null);
    this.websocket.onopen = (): void => this.dispatch('open', null);
    this.websocket.onmessage = this.onMessage;
  }

  public send = (eventType: string, data: any): EventEmitter => {
    const payload = JSON.stringify([eventType, data]);
    this.websocket.send(payload);
    return this;
  };

  public bind = (eventType: string, cb: () => void): EventEmitter => {
    if (!this.callbacks[eventType]) this.callbacks[eventType] = [];
    this.callbacks[eventType].push(cb);
    return this;
  };

  private onMessage = (evt: { data: string }): void => {
    const json = JSON.parse(evt.data);
    this.dispatch(json.event, json.data);
  };

  private dispatch = (eventName: string, message: string): void => {
    const chain = this.callbacks[eventName] || [];
    chain.forEach(cb => cb(message));
  };
}
