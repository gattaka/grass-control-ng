export class Item {

  name: string;
  path: string;
  directory: boolean;

  constructor(name: string, path: string, directory: boolean) {
    this.name = name;
    this.path = path;
    this.directory = directory;
  }
}
