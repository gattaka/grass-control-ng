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

  getApiItems(): Observable<Item[]> {
    return this.http.get<Item[]>('/api/list');
  }

  getVersion(): Observable<Version> {
    return this.http.get<Version>('/api/version');
  }
}
