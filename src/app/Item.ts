export class Item {

  name: string;
  path: string;
  parentName: string;
  parentPath: string;

  constructor(name: string, path: string, parentName: string, parentPath: string) {
    this.name = name;
    this.path = path;
    this.parentName = parentName;
    this.parentPath = parentPath;
  }
}
