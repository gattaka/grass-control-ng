export class Tag {

  title: string | null;
  artist: string;
  album: string;
  year: string;
  track: string;
  composer: string;


  constructor(title: string | null, artist: string, album: string, year: string, track: string, composer: string) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.year = year;
    this.track = track;
    this.composer = composer;
  }

}
