import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from './item';
import {AsyncPipe} from '@angular/common';
import {catchError, Observable, of} from 'rxjs';
import {MusicService} from './music.service';

@Component({
  selector: 'menu',
  imports: [
    AsyncPipe
  ],
  template: `
    <div id="menu-div">
      <div>
        <a href="/">GrassControl</a>
        <div class="menu-button" (click)="onReindex()">Reindex</div>
      </div>
      <div>
        @if (versionObs | async; as version) {
          <div>Version {{ version }}</div>
        } @else {
          <!--nic-->
        }
      </div>
    </div>`
})
export class MenuComponent implements OnInit {
  versionObs!: Observable<string | null>;

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    // https://stackoverflow.com/questions/79024569/how-to-use-angular-async-pipe-to-display-errors-and-loading-statuses-on-route-pa
    this.versionObs = this.musicService.getVersion().pipe(catchError(err => {
      return of(null);
    }));
  }

  onReindex() {
    this.musicService.reindex();
  }
}


