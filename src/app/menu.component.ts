import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Item} from './item';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
  selector: 'menu',
  imports: [
    AsyncPipe
  ],
  template: `
    <div id="menu-div">
      <div>
        <a href="/">GrassControl</a>
        <div class="menu-button" (click)="onReindex.emit($event)">Reindex</div>
      </div>
      <div>
        @if (versionObs | async; as version) {
          <div>Version {{ version }}</div>
        }
      </div>
    </div>`
})
export class MenuComponent {
  @Output() onReindex = new EventEmitter();
  @Input() versionObs!: Observable<string>;
}


