import {Component, inject} from '@angular/core';
import {ActionButtonComponent} from './action-button.component';
import {GridComponent} from './grid.component';
import {Item} from './Item';
import {MusicService} from './music.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ActionButtonComponent, GridComponent, AsyncPipe],
  template: `
    <div>
      Array size {{ this.items.length }}

      @if (apiItems | async; as apiItem) {
        <p>Name: {{ apiItem.name }}</p>
      }

      <action-button (btnEvent)="onBtn($event)" value="Add item"></action-button>
      <grid [items]="getItems()"></grid>
    </div>`
})
export class AppComponent {
  title = 'angularTest';
  items: Item[] = new Array();
  apiItems!: Observable<Item>;

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.apiItems = this.musicService.getApiItems();
  }

  getData() {
    return this.musicService.getApiItems();
  }

  getItems() {
    return this.musicService.getItems();
  }

  onBtn(item: Item) {
    this.items.push(item);
  }
}
