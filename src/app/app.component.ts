import {Component} from '@angular/core';
import {ActionButtonComponent} from './action-button.component';
import {GridComponent} from './grid.component';
import {Item} from './Item';

@Component({
  selector: 'app-root',
  imports: [ActionButtonComponent, GridComponent],
  template: `
    <div>
      Array size {{this.items.length}}
      <action-button (btnEvent)="onBtn($event)" value="Add item"></action-button>
      <grid [items]="items"></grid>
    </div>`
})
export class AppComponent {
  title = 'angularTest';
  items: Item[] = new Array();

  onBtn(item: Item) {
    this.items.push(item);
  }
}
