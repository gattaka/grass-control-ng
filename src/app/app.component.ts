import {Component, OnDestroy, OnInit} from '@angular/core';
import {GridComponent} from './grid.component';
import {Item} from './item';
import {MusicService} from './music.service';
import {Observable, Subscription, switchMap, timer} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Version} from './version';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlaylistItem} from './playlist.item';

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
          <button id="play-pause-btn" class="{{isPlaying() ? 'pause-btn' : 'play-btn'}}"
                  (click)="onPlayPause()"></button>
          <button id="prev-btn" (click)="onPrevious()"></button>
          <button id="stop-btn" (click)="onStop()"></button>
          <button id="next-btn" (click)="onNext()"></button>
          <button id="loop-btn" (click)="onLoop()" class="{{loop ? 'checked' : ''}}"></button>
          <button id="shuffle-btn" (click)="onRandom()" class="{{random ? 'checked' : ''}}"></button>
          <div id="volume-div">
            <input onblur="elementsUnderChange['volume-slider']=false;"
                   onchange="ajaxCall('volume?value='+this.value);"
                   onwheel="volumeControlScroll(event, val => {ajaxCall('volume?value='+val)});" type="range"
                   id="volume-slider" max="256" onmousedown="elementsUnderChange['volume-slider']=true;"
                   onmouseup="elementsUnderChange['volume-slider']=false;" min="0" value="{{volume}}">
            <span id="volume-span">{{ volumePerc }}%</span>
          </div>
        </div>
        <form [formGroup]="searchForm" (ngSubmit)="search()">
          <div id="search-div">
            <input id="search-input" autocomplete="do-not-autofill" type="text" formControlName="searchPhrase"/>
            <button type="submit">Vyhledat</button>
          </div>
        </form>
        @if (itemsObs | async; as items) {
          <grid class="table-div" id="library-table" (onChangeDir)="list($event)" (onEnque)="enqueue($event)"
                (onEnqueAndPlay)="enqueueAndPlay($event)" [items]="items"></grid>
        }
      </div>

      <div id="playlist-div">
        <form [formGroup]="searchPlaylistForm" (ngSubmit)="searchPlaylist()">
          <div id="search-div">
            <input id="search-playlist-input" autocomplete="do-not-autofill" type="text"
                   formControlName="searchPhrase"/>
            <button type="submit">Vyhledat</button>
          </div>
        </form>
        <div class="playlist-controls-div">
          <button (click)="emptyPlaylist()">Vyčistit</button>
          <button onclick="ajaxCall('clearExceptPlaying')">Nechat jet hrající</button>
        </div>
        <div id="playlist-table-div">
          <div class="table-div" id="playlist-table">
            <div class="table-head-div">
              <div class="table-head-tr-div">
                <div class="table-head-td-div playlist-name-div">Název</div>
                <div class="table-head-td-div playlist-length-div">Délka</div>
              </div>
            </div>
            <div class="table-body-div">
              @for (item of playlistItems; track item.name) {
                <div class="table-body-tr-div {{item.id == currentSongId ? 'table-tr-selected' : ''}}">
                  <div class="table-body-td-div playlist-name-div">
                    <div class="control-buttons-div">
                      <div>
                        <button class="table-control-btn" (click)="removeFromPlaylist(item.id)">✖</button>
                      </div>
                      <div>
                        <button class="table-control-btn" (click)="playFromPlaylist(item.id)">⏵</button>
                      </div>
                    </div>
                    <div class="item-div">
                      <div class="name-div">{{ item.name }}</div>
                      <div class="dir-info">{{ item.uri }}</div>
                    </div>
                  </div>
                  <div class="table-body-td-div playlist-length-div">{{ formatTime(item.length) }}</div>
                </div>
              }
            </div>
          </div>
        </div>
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
  currentSongId = 0;

  positionTime = "";
  lengthTime = "";

  totalSecs = 0;
  currentSecs = 0;

  random = false;
  loop = false;

  volume = 0;
  volumePerc = 0;

  state = "";

  statusSubscription !: Subscription;
  playlistSubscription !: Subscription;

  playlistItems = new Array<PlaylistItem>;

  searchForm = new FormGroup({
    searchPhrase: new FormControl('')
  });

  searchPlaylistPhrase: string | undefined;
  searchPlaylistForm = new FormGroup({
    searchPhrase: new FormControl('')
  });

  formatTime(timeInSec: number): string {
    if (timeInSec == -1) return "n/a";
    let minutes = Math.floor(timeInSec / 60);
    let seconds = timeInSec % 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  ngOnInit(): void {
    this.itemsObs = this.musicService.getRootItems();
    this.versionObs = this.musicService.getVersion();

    this.playlistSubscription = timer(0, 500).pipe(
      // TODO tady by to chtělo vyřešit handle chyb (err 404, 500 apod.), jinak se to celé zasekne
      switchMap(() => this.musicService.getPlaylist())
    ).subscribe(result => {
      this.playlistItems = new Array<PlaylistItem>;
      if (result) {
        const playlist = result["children"][0];
        if (playlist) {
          const songs = playlist["children"];
          for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const item = new PlaylistItem(song["name"], song["uri"], song["duration"], song["id"]);
            if (this.searchPlaylistPhrase) {
              if (item.name.toLowerCase().includes(this.searchPlaylistPhrase) || item.uri.toLowerCase().includes(this.searchPlaylistPhrase)) {
                this.playlistItems.push(item);
              }
            } else {
              this.playlistItems.push(item);
            }
          }
        }
      }
    });

    this.statusSubscription = timer(0, 500).pipe(
      // TODO tady by to chtělo vyřešit handle chyb (err 404, 500 apod.), jinak se to celé zasekne
      switchMap(() => this.musicService.getStatus())
    ).subscribe(result => {
        let info = result["information"];

        if (info) {
          let meta = info["category"]["meta"];
          this.currentSongArtist = meta["artist"];
          this.currentSongTitle = meta["title"];
          this.currentSongFile = meta["filename"];
        }

        this.currentSongId = result["currentplid"];
        this.totalSecs = result["length"];
        this.currentSecs = result["time"];
        this.positionTime = this.formatTime(this.currentSecs);
        this.lengthTime = this.formatTime(this.totalSecs);

        this.volume = result["volume"];
        this.volumePerc = Math.floor(this.volume / 256 * 100);

        this.random = result["random"];
        this.loop = result["loop"];

        this.state = result["state"];
      }
    );
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.playlistSubscription.unsubscribe();
  }

  constructor(private musicService: MusicService) {
  }

  search() {
    const value = this.searchForm.value.searchPhrase;
    this.itemsObs = this.musicService.getItemsBySearch(value);
  }

  searchPlaylist() {
    this.searchPlaylistPhrase = this.searchPlaylistForm.value.searchPhrase?.toLowerCase();
  }

  enqueue(path = "") {
    this.musicService.enqueue(path);
  }

  enqueueAndPlay(path = "") {
    this.musicService.enqueueAndPlay(path);
  }

  list(path = "") {
    this.itemsObs = this.musicService.getItems(path);
  }

  onReindex() {
    this.musicService.reindex();
  }

  isPlaying() {
    return this.state == "playing";
  }

  onPlayPause() {
    if (this.isPlaying()) {
      this.musicService.pause();
    } else {
      this.musicService.play();
    }
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

  playFromPlaylist(id: number) {
    this.musicService.playFromPlaylist(id);
  }

  removeFromPlaylist(id: number) {
    this.musicService.removeFromPlaylist(id);
  }

  emptyPlaylist() {
    this.musicService.emptyPlaylist();
  }
}
