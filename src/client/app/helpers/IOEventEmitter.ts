import { Message } from '@shared/types/messages';
import { io, Socket } from 'socket.io-client';
import {
  Callback,
  Callbacks,
  DataByEventName,
  EventByName,
  EventType,
  IOEvent,
} from '../../../shared/types/eventTypes';

export default class IOEventEmitter {
  private socket: Socket;
  private callbacks: Callbacks = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.init();
  }

  private init = (): void => {
    this.socket = io(this.url);
    this.socket.onAny((event, payload) => {
      this.execute(event, payload);
    });

    this.bind('error', this.handleError);
  };

  public sendMessage = (payload: Message) => {
    this.send('clientMessage', payload);
  };

  public send = <T extends EventType>(
    eventType: T,
    data: DataByEventName<T>,
  ): void => {
    console.log('sending', eventType, data);
    this.socket.emit(eventType, data);
  };

  public bind = <T extends EventType>(
    eventType: T,
    cb: Callback<EventByName<T>>,
  ): void => {
    if (!this.callbacks[eventType]) this.callbacks[eventType] = [];
    this.callbacks[eventType].push(cb);
  };

  private execute = <T extends EventType, W extends IOEvent = EventByName<T>>(
    eventName: W['event'],
    data: W['data'],
  ): void => {
    const chain: Callback<W>[] = this.callbacks[eventName] || [];
    chain.forEach((cb) => cb(data));
  };

  private handleError = (message: string): void => {
    console.log(`Socket encountered error: ${message}`);
  };
}
