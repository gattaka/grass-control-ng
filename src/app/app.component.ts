import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ActionButtonComponent} from './action-button.component';
import {GridComponent} from './grid.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ActionButtonComponent, GridComponent],
  template: `
    <div>
      Array size {{this.items.length}}
      <action-button (btnEvent)="onBtn($event)"></action-button>
      <grid [items]="items"></grid>
    </div>`
})
export class AppComponent {
  title = 'angularTest';
  items: string[] = new Array();

  onBtn(item: string) {
    this.items.push(item);
  }
}
