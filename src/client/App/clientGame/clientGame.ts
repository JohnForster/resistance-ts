import ClientPlayer from './clientPlayer';

export default class ClientGame {
  public id: string;
  public isHosting: boolean;
  public hasStarted = false;
  public host: ClientPlayer;
  public players: ClientPlayer[] = [];

  constructor({ id, isHosting, player }: { id: string; isHosting: boolean; player: ClientPlayer }) {
    this.id = id;
    this.isHosting = isHosting;
    this.host = player;
    this.players.push(player);
  }
}
