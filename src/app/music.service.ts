import {Injectable} from '@angular/core';
import {Item} from './item';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {CurrentSong} from './current-song';
import {SeekInfo} from './seek.info';
import {ControlsInfo} from './controls.info';
import {Status} from './status';
import {PlaylistItem} from './playlist-item';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  constructor(private http: HttpClient) {
  }

  play() {
    this.http.get('/api/play').subscribe();
  }

  stop() {
    this.http.get('/api/stop').subscribe();
  }

  pause() {
    this.http.get('/api/pause').subscribe();
  }

  previous() {
    this.http.get('/api/previous').subscribe();
  }

  next() {
    this.http.get('/api/next').subscribe();
  }

  loop() {
    this.http.get('/api/loop').subscribe();
  }

  random() {
    this.http.get('/api/random').subscribe();
  }

  repeat() {
    this.http.get('/api/repeat').subscribe()
  }

  reindex() {
    this.http.get('/api/reindex').subscribe();
  }

  getItems(path = ""): Observable<Item[]> {
    return this.http.get<Item[]>('/api/list?path=' + path);
  }

  getRootItems(): Observable<Item[]> {
    return this.http.get<Item[]>('/api/list');
  }

  getVersion(): Observable<string> {
    return this.http.get<any>('/api/version').pipe(map(result => result["version"]));
  }

  getItemsBySearch(searchPhrase: string | null | undefined): Observable<Item[]> {
    return this.http.get<Item[]>('/api/search?searchPhrase=' + searchPhrase);
  }

  getStatus() {
    return this.http.get<any>('/api/status').pipe(map(
      result => {
        let info = result["information"];

        if (info) {
          let meta = info["category"]["meta"];
          const currentSong = CurrentSong.create(meta["artist"], meta["title"], meta["filename"], result["currentplid"])
          const seekInfo = SeekInfo.create(result["length"], result["time"])
          const controlsInfo = ControlsInfo.create(result["state"], result["random"], result["loop"], result["volume"]);
          return Status.create(currentSong, seekInfo, controlsInfo);
        } else {
          return Status.createEmpty();
        }
      }));
  }

  enqueue(path: string) {
    this.http.get('/api/enqueue?path=' + path).subscribe();
  }

  enqueueAndPlay(path: string) {
    this.http.get('/api/enqueue-and-play?path=' + path).subscribe();
  }

  getPlaylist(searchPlaylistPhrase: string | undefined) {
    return this.http.get<any>('/api/playlist').pipe(map(result => {
        const playlistItems = [];
        if (result) {
          const playlist = result["children"][0];
          if (playlist) {
            const songs = playlist["children"];
            for (let i = 0; i < songs.length; i++) {
              const song = songs[i];
              const item = new PlaylistItem(song["name"], song["uri"], song["duration"], song["id"]);
              if (searchPlaylistPhrase) {
                if (item.name.toLowerCase().includes(searchPlaylistPhrase) || item.uri.toLowerCase().includes(searchPlaylistPhrase)) {
                  playlistItems.push(item);
                }
              } else {
                playlistItems.push(item);
              }
            }
          }
        }
        return playlistItems;
      }
    ));
  }

  playFromPlaylist(id: number) {
    this.http.get('/api/playFromPlaylist?id=' + id).subscribe();
  }

  removeFromPlaylist(id: number) {
    this.http.get('/api/removeFromPlaylist?id=' + id).subscribe();
  }

  emptyPlaylist() {
    this.http.get('/api/emptyPlaylist').subscribe();
  }

  emptyPlaylistExceptPlaying() {
    this.http.get('/api/emptyPlaylistExceptPlaying').subscribe();
  }

  seek(position: number) {
    this.http.get('/api/seek?position=' + position).subscribe();
  }

  volume(position: number) {
    this.http.get('/api/volume?position=' + position).subscribe();
  }
}
