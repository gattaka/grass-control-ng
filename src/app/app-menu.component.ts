import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from './item';
import {AsyncPipe} from '@angular/common';
import {catchError, Observable, of, retry, tap, timer} from 'rxjs';
import {MusicService} from './music.service';

@Component({
  selector: 'app-menu',
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
export class AppMenuComponent implements OnInit {
  versionObs!: Observable<string | null>;

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.versionObs = this.musicService.getVersion().pipe(
      retry({
        delay: (_) => {
          return timer(2000);
        }
      }));
  }

  onReindex() {
    this.musicService.reindex();
  }
}


