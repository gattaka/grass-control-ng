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
          <button id="play-pause-btn" class="play-btn"></button>
          <button id="prev-btn"></button>
          <button id="stop-btn"></button>
          <button id="next-btn"></button>
          <button id="loop-btn"></button>
          <button id="shuffle-btn"></button>
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
          <button class="table-control-btn">⏵</button>
          <button class="table-control-btn">+</button>
          <button class="table-control-btn">⮭</button>
          <span>Vypisuji výsledek adresáře "/2000s"</span>
        </div>

        @if (itemsObs | async; as items) {
          <!-- TODO pokud nepředávám string, jak předám hodnotu? $event je jenom string, ale EventEmitter má volnou parametrizaci :( -->
          <grid class="table-div" id="library-table" (onChangeDir)="list($event)" [items]="items"></grid>
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

  list(path="") {
    this.itemsObs = this.musicService.getItems(path);
  }

  onReindex() {
    this.musicService.reindex();
  }

  ngOnInit(): void {
    this.itemsObs = this.musicService.getRootItems();
    this.versionObs = this.musicService.getVersion();
  }
}
