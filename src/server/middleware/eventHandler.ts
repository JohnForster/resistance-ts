// import { Game } from '@server/models/newGame/newGame';
// import { Message } from '@shared/types/messages';
// import http from 'http';
// import { Server as IoServer, Socket } from 'socket.io';

// const users = new Map<string, User>();

// const eventHandler = (server: http.Server) => {
//   const io = new IoServer(server);
//   io.on('connection', (socket: Socket) => {
//     const id = socket.id // Should I get the id from somewhere lese?
//     const user = users.get()
//     let previousId: string;

//     const safeJoin = (currentId: string) => {
//       socket.leave(previousId);
//       socket.join(currentId);
//       previousId = currentId;
//     };

//     socket.on('gameUpdate', (update: Message) => {
//       game
//     })
//   });
// };
