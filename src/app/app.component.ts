import {Component, OnDestroy, OnInit} from '@angular/core';
import {GridComponent} from './grid.component';
import {Item} from './item';
import {MusicService} from './music.service';
import {Observable, Subscription, switchMap, timer} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlaylistItem} from './playlist.item';
import {MenuComponent} from './menu.component';
import {CurrentSongComponent} from './current.song.component';
import {CurrentSong} from './current.song';
import {SeekBarComponent} from './seek.bar.component';
import {SeekInfo} from './seek.info';
import {Utils} from './utils';
import {ControlsComponent} from './controls.component';
import {ControlsInfo} from './controls.info';

@Component({
  selector: 'app-root',
  imports: [GridComponent, AsyncPipe, FormsModule, ReactiveFormsModule, MenuComponent, CurrentSongComponent, SeekBarComponent, ControlsComponent],
  template: `
    <menu (onReindex)="onReindex()" [versionObs]="versionObs"></menu>
    <div id="main-div">
      <div id="library-div">
        <current-song [currentSong]="currentSong"></current-song>
        <seek-bar (seekChange)="seekChange($event)" (seekScroll)="seekScroll($event)"
                  [seekInfo]="seekInfo"></seek-bar>
        <controls [controlsInfo]="controlsInfo"></controls>
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
          <button (click)="emptyPlaylistExceptPlaying()">Nechat jet hrající</button>
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
                <div class="table-body-tr-div {{item.id == currentSong.id ? 'table-tr-selected' : ''}}">
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
                  <div class="table-body-td-div playlist-length-div">{{ Utils.formatTime(item.length) }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

    </div>`
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly Utils = Utils;

  title = 'angularTest';
  // ! = To avoid error, inform the compiler that this variable will never be undefined or null
  itemsObs!: Observable<Item[]>;
  versionObs!: Observable<string>;

  currentSong = CurrentSong.createEmpty();
  seekInfo = SeekInfo.createEmpty();
  controlsInfo = ControlsInfo.createEmpty();

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

  constructor(private musicService: MusicService) {
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
          this.currentSong = CurrentSong.create(meta["artist"], meta["title"], meta["filename"], result["currentplid"])
        }

        this.seekInfo = SeekInfo.create(result["length"], result["time"])
        this.controlsInfo = ControlsInfo.create(result["state"], result["random"], result["loop"], result["volume"]);
      }
    );
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.playlistSubscription.unsubscribe();
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

  playFromPlaylist(id: number) {
    this.musicService.playFromPlaylist(id);
  }

  removeFromPlaylist(id: number) {
    this.musicService.removeFromPlaylist(id);
  }

  emptyPlaylist() {
    this.musicService.emptyPlaylist();
  }

  emptyPlaylistExceptPlaying() {
    this.musicService.emptyPlaylistExceptPlaying();
  }

  seekScroll(event: WheelEvent) {
    let slider: any = event.target;
    let newVal = Number(slider.value) + Math.sign(-event.deltaY) * 5;
    slider.value = newVal;
    this.musicService.seek(newVal);
  }

  seekChange(event: Event) {
    let slider: any = event.target;
    this.musicService.seek(slider.value);
  }

}
