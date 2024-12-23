import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Item} from './item';
import {ActionButtonComponent} from './action-button.component';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MusicService} from './music.service';
import {catchError, Observable, of, Subscription, switchMap, timer} from 'rxjs';
import {TimeFormatPipe} from './time-format.pipe';
import {PlaylistItem} from './playlist-item';
import {Tag} from './tag';

@Component({
  selector: 'playlist',
  template: `
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
    @if (!playlistUnavailable) {
      <div id="playlist-table-div">
        <div class="table-div" id="playlist-table">
          <div class="table-head-div">
            <div class="table-head-tr-div">
              <div class="table-head-td-div playlist-name-div">Název</div>
              <div class="table-head-td-div playlist-length-div">Délka</div>
            </div>
          </div>
          <div class="table-body-div">
            @for (item of playlistItems; track item.id) {
              <div class="table-body-tr-div {{item.id == currentSongId ? 'table-tr-selected' : ''}}">
                <div class="table-body-td-div playlist-name-div">
                  <div class="control-buttons-div">
                    <div>
                      <button class="table-control-btn" (click)="removeFromPlaylist(item.id)">✖</button>
                    </div>
                    <div>
                      <button class="table-control-btn" (click)="playFromPlaylist(item.id)">⏵</button>
                    </div>
                    <div>
                      <button class="table-control-btn" (click)="readTag(item.id)">i</button>
                    </div>
                    <div>
                      <button class="table-control-btn" (click)="writeTag(item.id)">!!!</button>
                    </div>
                  </div>
                  <div class="item-div">
                    <div class="name-div">{{ item.name }}</div>
                    <div class="dir-info">{{ item.uri }}</div>
                  </div>
                </div>
                <div class="table-body-td-div playlist-length-div">{{ item.length | timeFormat }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div id="playlist-unavailable-div">⚠️ Playlist není dostupný</div>
    }`,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TimeFormatPipe
  ]
})
export class PlaylistComponent implements OnInit, OnDestroy {
  @Input() currentSongId = 0;

  playlistUnavailable = false;
  playlistSubscription !: Subscription;
  playlistItems = new Array<PlaylistItem>;

  searchPlaylistPhrase: string | undefined;
  searchPlaylistForm = new FormGroup({
    searchPhrase: new FormControl('')
  });

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.playlistSubscription = timer(0, 500).pipe(
      switchMap(_ => this.musicService.getPlaylist(this.searchPlaylistPhrase).pipe(
        catchError(err => {
            this.playlistUnavailable = true;
            return of(null);
          }
        )
      ))
    ).subscribe(
      result => {
        if (result) {
          this.playlistUnavailable = false;
          this.playlistItems = result;
        }
      }
    );
  }

  ngOnDestroy() {
    this.playlistSubscription.unsubscribe();
  }

  searchPlaylist() {
    this.searchPlaylistPhrase = this.searchPlaylistForm.value.searchPhrase?.toLowerCase();
  }

  readTag(id: number) {
    this.musicService.readTag(id);
  }

  writeTag(id: number) {
    // TODO content
    const tag = new Tag("MyTitle", "MyArtist", "MyAlbum", "MyYear", "MyTrack", "MyComposer");
    this.musicService.writeTag(id, tag);
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
}
