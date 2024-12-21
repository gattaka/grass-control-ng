export class PlaylistItem {

  name: string;
  uri:string;
  length: number;
  id:number;

  constructor(name: string, uri: string, length: number, id: number) {
    this.name = name;
    this.uri = uri;
    this.length = length;
    this.id = id;
  }
}
