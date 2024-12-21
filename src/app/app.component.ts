import {Component, OnDestroy, OnInit} from '@angular/core';
import {LibraryComponent} from './library.component';
import {MusicService} from './music.service';
import {Observable, Subscription, switchMap, timer} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuComponent} from './menu.component';
import {CurrentSongComponent} from './current-song.component';
import {CurrentSong} from './current-song';
import {SeekBarComponent} from './seek-bar.component';
import {SeekInfo} from './seek.info';
import {ControlsComponent} from './controls.component';
import {ControlsInfo} from './controls.info';
import {PlaylistComponent} from './playlist.component';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, MenuComponent, CurrentSongComponent, SeekBarComponent, ControlsComponent, LibraryComponent, PlaylistComponent],
  template: `
    <menu (onReindex)="onReindex()" [versionObs]="versionObs"></menu>
    <div id="main-div">
      <div id="left-div">
        <current-song [currentSong]="currentSong"></current-song>
        <seek-bar [seekInfo]="seekInfo"></seek-bar>
        <controls [controlsInfo]="controlsInfo"></controls>
        <library></library>
      </div>
      <div id="right-div">
        <playlist [currentSongId]="currentSong.id"></playlist>
      </div>
    </div>`
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angularTest';
  versionObs!: Observable<string>;

  currentSong = CurrentSong.createEmpty();
  seekInfo = SeekInfo.createEmpty();
  controlsInfo = ControlsInfo.createEmpty();

  statusSubscription !: Subscription;

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.versionObs = this.musicService.getVersion();

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
  }

  onReindex() {
    this.musicService.reindex();
  }

}
