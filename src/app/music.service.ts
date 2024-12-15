import {Injectable} from '@angular/core';
import {Item} from './Item';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  constructor(private http: HttpClient) {
  }

  getItems(): Item[] {
    return [
      new Item("70s", "/70s", "Hudba", "/", []),
      new Item("80s", "/80s", "Hudba", "/", []),
      new Item("90s", "/90s", "Hudba", "/", []),
    ];
  }

  getApiItems(): Observable<Item> {
    return this.http.get<Item>('/api/test.json');
  }
}
