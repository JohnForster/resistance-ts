export default class ClientPlayer {
  name: string;
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  setName = (name: string): void => {
    this.name = name;
  };
}
