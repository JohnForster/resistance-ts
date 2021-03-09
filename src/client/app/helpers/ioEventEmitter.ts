import io from 'socket.io-client';
import {
  Callback,
  Callbacks,
  DataByEventName,
  EventByName,
  EventType,
  ServerMessageEvent,
  WSEvent,
} from '../../../shared/types/eventTypes';

export default class IOEventEmitter {
  private connection: SocketIOClient.Socket;
  private callbacks: Callbacks = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.init();
  }

  private init = (): void => {
    this.connection = io(this.url);
    // this.websocket.onclose = (): void => this.execute('close', null);
    // this.websocket.onopen = (): void => this.execute('open', 'opening');
    // this.websocket.onerror = this.handleError;
    this.connection.on('serverMessage', this.onMessage);
  };

  public sendMessage = (payload: DataByEventName<'clientMessage'>) => {
    this.send('clientMessage', payload);
  };

  public send = <T extends EventType>(
    eventType: T,
    data: DataByEventName<T>,
  ): IOEventEmitter => {
    // TODO try/catch
    console.log('sending event', eventType);
    this.connection.emit(eventType, data);
    return this;
  };

  public bind = <T extends EventType>(
    eventType: T,
    cb: Callback<EventByName<T>>,
  ): IOEventEmitter => {
    if (!this.callbacks[eventType]) this.callbacks[eventType] = [];
    this.callbacks[eventType].push(cb as any);
    return this;
  };

  private onMessage = (event: ServerMessageEvent): void => {
    console.log('Message received. Event:', event);
    // // const json: WSEvent = JSON.parse(evt.data);
    // console.log('Websocket data recieved:', json);
    // this.execute(json.event, json.data);
  };

  private execute = <T extends EventType, W extends WSEvent = EventByName<T>>(
    eventName: W['event'],
    data: W['data'],
  ): void => {
    const chain: Callback<W>[] = (this.callbacks[eventName] || []) as any;
    chain.forEach((cb) => cb(data));
  };

  private handleError = (error: Error): void => {
    console.log(`Socket encountered error: ${error.message}`);
  };
}
