export class CurrentSong {

  artist: string
  title: string
  file: string
  id: number

  static createEmpty() {
    return new CurrentSong("", "", "", 0)
  }

  static create(artist: string, title: string, file: string, id: number) {
    return new CurrentSong(artist, title, file, id);
  }

  private constructor(artist: string, title: string, file: string, id: number) {
    this.artist = artist;
    this.title = title;
    this.file = file;
    this.id = id;
  }
}
