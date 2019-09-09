// import { WSEvent, JoinEvent, CreateEvent, OpenEvent, CloseEvent } from '../../shared/types/eventTypes';

// export default class WSEventHandler {
//   handle = (msg: string): void => {
//     const { event, data }: WSEvent = JSON.parse(msg);
//     if (event === 'message') this.handleMessage(data as MessageEvent['data']);
//     if (event === 'join_game') this.handleJoinGame(data as JoinEvent['data']);
//     if (event === 'create_game') this.handleCreateGame(data as CreateEvent['data']);
//     if (event === 'open') this.handleOpen(data as OpenEvent['data']);
//     if (event === 'close') this.handleClose(data as CloseEvent['data']);
//   };

//   handleMessage = (data: MessageEvent['data']): void => {};
//   handleJoinGame = (data: JoinEvent['data']): void => {};
//   handleCreateGame = (data: CreateEvent['data']): void => {

//   };
//   handleOpen = (data: OpenEvent['data']): void => {};
//   handleClose = (data: CloseEvent['data']): void => {};
// }
