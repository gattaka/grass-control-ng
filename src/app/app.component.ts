import {Component} from '@angular/core';
import {GridComponent} from './grid.component';
import {Item} from './Item';
import {MusicService} from './music.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Version} from './version';

@Component({
  selector: 'app-root',
  imports: [ GridComponent, AsyncPipe],
  template: `
    <div class="menu-div">
      <div>
        <a href="/">GrassControl</a>
        <div class="menu-button" (click)="onReindex()">Reindex</div>
      </div>
      <div>
        @if (versionObs | async; as version) {
          <div>Version {{ version.version }}</div>
        }
      </div>
    </div>

    <div id="main-div">
      <div id="library-div">
        <div id="current-song-div">-</div>
        <div id="progress-div">
          <span id="progress-time-span">00:00</span>
          <input type="range" id="progress-slider" onmousedown="elementsUnderChange['progress-slider']=true;"
                 onmouseup="elementsUnderChange['progress-slider']=false;"
                 onblur="elementsUnderChange['progress-slider']=false;"
                 onchange="ajaxCall('progress?value='+this.value);"
                 onwheel="progressControlScroll(event, val => {ajaxCall('progress?value='+val)});" min="0" max="0">
          <span id="progress-length-span">00:00</span>
        </div>
        <div class="controls-div">
          <input type="button" onclick="ajaxCall('pause')" id="play-pause-btn" class="play-btn">
          <input onclick="ajaxCall('prev')" id="prev-btn" type="button">
          <input onclick="ajaxCall('stop')" id="stop-btn" type="button">
          <input onclick="ajaxCall('next')" id="next-btn" type="button">
          <input onclick="ajaxCall('loop')" id="loop-btn" type="button">
          <input onclick="ajaxCall('shuffle')" id="shuffle-btn" type="button">
          <div id="volume-div">
            <input onblur="elementsUnderChange['volume-slider']=false;"
                   onchange="ajaxCall('volume?value='+this.value);"
                   onwheel="volumeControlScroll(event, val => {ajaxCall('volume?value='+val)});" type="range"
                   id="volume-slider" max="320" onmousedown="elementsUnderChange['volume-slider']=true;"
                   onmouseup="elementsUnderChange['volume-slider']=false;" min="0">
            <span id="volume-span">0%</span>
          </div>
        </div>
        <form class="search-form" method="get" action="/">
          <span>Vyhledat</span>
          <input id="search-input" autocomplete="do-not-autofill" type="text" name="grass-control-search">
        </form>
        <div class="location-div">
          <input class="table-control-btn" value="⏵" onclick="ajaxCall('/addAndPlay?id=%2F2000s')" type="button">
          <input class="table-control-btn" type="button" value="＋" onclick="ajaxCall('/add?id=%2F2000s')">
          <input value="⮭" onclick="window.location.href='/?dir=%2F'" type="button">
          <span>Vypisuji výsledek adresáře "/2000s"</span>
        </div>

        @if (itemsObs | async; as items) {
          <grid class="table-div" id="library-table" [items]="items"></grid>
        }
      </div>
    </div>`
})
export class AppComponent {
  title = 'angularTest';
  // ! = To avoid error, inform the compiler that this variable will never be undefined or null
  itemsObs!: Observable<Item[]>;
  versionObs!: Observable<Version>;

  constructor(private musicService: MusicService) {
  }

  onReindex() {
    this.itemsObs = this.musicService.getApiItems();
  }

  ngOnInit(): void {
    this.itemsObs = this.musicService.getApiItems();
    this.versionObs = this.musicService.getVersion();
  }
}
