import {Injectable} from '@angular/core';
import {Item} from './item';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Version} from './version';

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

  getVersion(): Observable<Version> {
    return this.http.get<Version>('/api/version');
  }

  getItemsBySearch(searchPhrase: string | null | undefined): Observable<Item[]> {
    return this.http.get<Item[]>('/api/search?searchPhrase=' + searchPhrase);
  }

  getStatus() {
    return this.http.get<any>('/api/status');
  }

  enqueue(path: string) {
    this.http.get('/api/enqueue?path=' + path).subscribe();
  }

  enqueueAndPlay(path: string) {
    this.http.get('/api/enqueue-and-play?path=' + path).subscribe();
  }

  getPlaylist() {
    return this.http.get<any>('/api/playlist');
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
