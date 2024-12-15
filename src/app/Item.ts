export class Item {

  name: string;
  path: string;
  parentName: string;
  parentPath: string;
  children: Item[] = new Array();

  constructor(name: string, path: string, parentName: string, parentPath: string, children: Item[]) {
    this.name = name;
    this.path = path;
    this.parentName = parentName;
    this.parentPath = parentPath;
    this.children = children;
  }
}
