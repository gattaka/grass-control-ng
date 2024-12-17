import {Component, OnDestroy, OnInit} from '@angular/core';
import {GridComponent} from './grid.component';
import {Item} from './item';
import {MusicService} from './music.service';
import {Observable, Subscription, switchMap, timer} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Version} from './version';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [GridComponent, AsyncPipe, FormsModule, ReactiveFormsModule],
  template: `
    <div id="menu-div">
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
        <div id="current-song-div">
          <div id="current-song-artist">{{ currentSongArtist }}</div>
          -
          <div id="current-song-title">{{ currentSongTitle }}</div>
          <div id="current-song-file">{{ currentSongFile }}</div>
        </div>
        <div id="progress-div">
          <span id="progress-time-span">{{ positionTime }}</span>
          <input type="range" id="progress-slider" onmousedown="elementsUnderChange['progress-slider']=true;"
                 onmouseup="elementsUnderChange['progress-slider']=false;"
                 onblur="elementsUnderChange['progress-slider']=false;"
                 onchange="ajaxCall('progress?value='+this.value);"
                 onwheel="progressControlScroll(event, val => {ajaxCall('progress?value='+val)});" min="0"
                 max="{{totalSecs}}" value="{{ currentSecs }}"/>
          <span id="progress-length-span">{{ lengthTime }}</span>
        </div>
        <div class="controls-div">
          <button id="play-pause-btn" class="play-btn" (click)="onPlayPause()"></button>
          <button id="prev-btn" (click)="onPrevious()"></button>
          <button id="stop-btn" (click)="onStop()"></button>
          <button id="next-btn" (click)="onNext()"></button>
          <button id="loop-btn" (click)="onLoop()"></button>
          <button id="shuffle-btn" (click)="onRandom()"></button>
          <div id="volume-div">
            <input onblur="elementsUnderChange['volume-slider']=false;"
                   onchange="ajaxCall('volume?value='+this.value);"
                   onwheel="volumeControlScroll(event, val => {ajaxCall('volume?value='+val)});" type="range"
                   id="volume-slider" max="320" onmousedown="elementsUnderChange['volume-slider']=true;"
                   onmouseup="elementsUnderChange['volume-slider']=false;" min="0">
            <span id="volume-span">0%</span>
          </div>
        </div>
        <form [formGroup]="searchForm" (ngSubmit)="search()">
          <div id="search-div">
            <input id="search-input" autocomplete="do-not-autofill" type="text" formControlName="searchPhrase"/>
            <button type="submit">Vyhledat</button>
          </div>
        </form>
        @if (itemsObs | async; as items) {
          <grid class="table-div" id="library-table" (onChangeDir)="list($event)" [items]="items"></grid>
        }
      </div>
    </div>`
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angularTest';
  // ! = To avoid error, inform the compiler that this variable will never be undefined or null
  itemsObs!: Observable<Item[]>;
  versionObs!: Observable<Version>;

  currentSongFile = "";
  currentSongArtist = "";
  currentSongTitle = "";

  positionTime = "";
  lengthTime = "";

  totalSecs = 0;
  currentSecs = 0;

  subscription !: Subscription;

  searchForm = new FormGroup({
    searchPhrase: new FormControl('')
  });

  formatTime(timeInSec: number): string {
    let minutes = Math.floor(timeInSec / 60);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (timeInSec % 60);
  }

  ngOnInit(): void {
    this.itemsObs = this.musicService.getRootItems();
    this.versionObs = this.musicService.getVersion();

    this.subscription = timer(0, 5000).pipe(
      switchMap(() => this.musicService.getStatus())
    ).subscribe(result => {
        let info = result["information"];
        let meta = info["category"]["meta"];
        this.currentSongArtist = meta["artist"];
        this.currentSongTitle = meta["title"];
        this.currentSongFile = meta["filename"];

        this.totalSecs = result["length"];
        this.currentSecs = result["time"];
        this.positionTime = this.formatTime(this.currentSecs);
        this.lengthTime = this.formatTime(this.totalSecs);

        console.log(this.currentSecs);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private musicService: MusicService) {
  }

  search() {
    const value = this.searchForm.value.searchPhrase;
    this.itemsObs = this.musicService.getItemsBySearch(value);
  }

  list(path = "") {
    this.itemsObs = this.musicService.getItems(path);
  }

  onReindex() {
    this.musicService.reindex();
  }

  onPlayPause() {
    this.musicService.play();
  }

  onStop() {
    this.musicService.stop();
  }

  onPrevious() {
    this.musicService.previous();
  }

  onNext() {
    this.musicService.next();
  }

  onLoop() {
    this.musicService.loop();
  }

  onRandom() {
    this.musicService.random();
  }
}
