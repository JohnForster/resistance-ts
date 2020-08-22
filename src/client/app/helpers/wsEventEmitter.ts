import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { EventByName, WSEvent, Callbacks, Callback } from '@shared/types/eventTypes';
import { EventType } from '@client/types/event';
type EventType = typeof EventType[keyof typeof EventType];

export default class WSEventEmitter {
  private websocket: W3CWebSocket;
  private callbacks: Callbacks = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.init();
    this.bind(EventType.close, this.reconnect);
  }

  private init = (): void => {
    this.websocket = new W3CWebSocket(this.url);
    this.websocket.onclose = (): void => this.execute(EventType.close, null);
    this.websocket.onopen = (): void => this.execute(EventType.open, 'opening');
    this.websocket.onerror = this.handleError;
    this.websocket.onmessage = this.onMessage;
  };

  public send = <T extends EventType, W extends WSEvent = EventByName<T>>(
    eventType: W['event'],
    data: W['data'],
  ): WSEventEmitter => {
    const payload = JSON.stringify([eventType, data]);
    this.websocket.send(payload);
    return this;
  };

  public bind = <T extends EventType, W extends WSEvent = EventByName<T>>(
    eventType: W['event'],
    cb: Callback<W>,
  ): WSEventEmitter => {
    if (!this.callbacks[eventType]) this.callbacks[eventType] = [];
    this.callbacks[eventType].push(cb);
    return this;
  };

  private onMessage = (evt: { data: string }): void => {
    const json: WSEvent = JSON.parse(evt.data);
    console.log('Websocket data recieved:', json);
    this.execute(json.event, json.data);
  };

  private execute = <T extends EventType, W extends WSEvent = EventByName<T>>(
    eventName: W['event'],
    data: W['data'],
  ): void => {
    const chain: Callback<W>[] = this.callbacks[eventName] || [];
    chain.forEach(cb => cb(data));
  };

  private handleError = (error: Error): void => {
    console.log(`Socket encountered error: ${error.message}`);
    this.websocket.close();
  };

  private reconnect = (): void => {
    setTimeout(this.init, 1000);
  };

  // private beginPings = (): void => {
  //   setInterval(() => {
  //     this.websocket.send('ping');
  //   }, 5000);
  // };
}
