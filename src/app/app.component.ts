import {Component, OnDestroy, OnInit} from '@angular/core';
import {LibraryComponent} from './library.component';
import {MusicService} from './music.service';
import {catchError, Observable, of, Subscription, switchMap, timer} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuComponent} from './menu.component';
import {CurrentSongComponent} from './current-song.component';
import {SeekBarComponent} from './seek-bar.component';
import {ControlsComponent} from './controls.component';
import {PlaylistComponent} from './playlist.component';
import {Status} from './status';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, MenuComponent, CurrentSongComponent, SeekBarComponent, ControlsComponent, LibraryComponent, PlaylistComponent],
  template: `
    <menu></menu>
    @if (errorMsg.length > 0) {
      <div id="error-msg">{{ errorMsg }}</div>
    }
    <div id="main-div">
      <div id="left-div">
        <current-song [currentSong]="status.currentSong"></current-song>
        <seek-bar [seekInfo]="status.seekInfo"></seek-bar>
        <controls [controlsInfo]="status.controlsInfo"></controls>
        <library></library>
      </div>
      <div id="right-div">
        <playlist [currentSongId]="status.currentSong.id"></playlist>
      </div>
    </div>`
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angularTest';

  errorMsg = "";

  status = Status.createEmpty();
  statusSubscription !: Subscription;

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {

    // https://stackoverflow.com/questions/65662690/timer-stops-whenever-an-error-occurred-in-the-subscription
    // https://stackoverflow.com/a/65663035
    this.statusSubscription = timer(0, 500).pipe(
      switchMap(_ => this.musicService.getStatus().pipe(
        catchError(err => {
            this.errorMsg = "Připojení k serveru selhalo";
            const details = err["error"];
            if (details)
              this.errorMsg += " (" + details + ")";
            return of(null);
          }
        )
      ))
    ).subscribe(
      status => {
        if (status) {
          this.status = status;
          this.errorMsg = "";
        }
      }
    );
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }
}
