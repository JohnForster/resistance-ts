import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {
  EventType,
  EventByName,
  WSEvent,
  Callbacks,
  Callback,
  DataByEventName,
} from '@shared/types/eventTypes';

export default class WSEventEmitter {
  private websocket: W3CWebSocket;
  private callbacks: Callbacks = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.init();
    this.bind('close', this.reconnect);
  }

  private init = (): void => {
    this.websocket = new W3CWebSocket(this.url);
    this.websocket.onclose = (): void => this.execute('close', null);
    this.websocket.onopen = (): void => this.execute('open', 'opening');
    this.websocket.onerror = this.handleError;
    this.websocket.onmessage = this.onMessage;
  };

  public sendMessage = (payload: DataByEventName<'clientMessage'>) => {
    this.send('clientMessage', payload);
  };

  public send = <T extends EventType>(
    eventType: T,
    data: DataByEventName<T>,
  ): WSEventEmitter => {
    // TODO try/catch
    const payload = JSON.stringify([eventType, data]);
    this.websocket.send(payload);
    return this;
  };

  public bind = <T extends EventType>(
    eventType: T,
    cb: Callback<EventByName<T>>,
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
    chain.forEach((cb) => cb(data));
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
