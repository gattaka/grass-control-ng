import {Injectable} from '@angular/core';
import {Item} from './Item';
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

}
