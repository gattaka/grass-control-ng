import {Component, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {Observable, retry, timer} from 'rxjs';
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
        <div class="menu-button" (click)="onStartVLC()">Start VLC</div>
      </div>
      <div>
        <div class="menu-button" (click)="onShutdown()">Shutdown</div>
        @if (versionObs | async; as version) {
          <div>Version {{ version }}</div>
        } @else {
          <!--nic-->
        }
      </div>
    </div>`
})
export class AppMenuComponent implements OnInit {
  versionObs!: Observable<string>;

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

  onStartVLC() {
    this.musicService.startVLC();
  }

  onShutdown() {
    this.musicService.shutdown();
  }
}
