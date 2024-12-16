import {Injectable} from '@angular/core';
import {Item} from './Item';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Version} from './version';
import {FormControl, ɵValue} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  constructor(private http: HttpClient) {
  }

  reindex() {
    this.http.get<Item[]>('/api/reindex');
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

  getItemsBySearch(searchPhrase: ɵValue<FormControl<string | null>> | undefined): Observable<Item[]> {
    return this.http.get<Item[]>('/api/search?searchPhrase=' + searchPhrase);
  }
}
