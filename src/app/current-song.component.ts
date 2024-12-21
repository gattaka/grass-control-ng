import {Component, Input} from '@angular/core';
import {CurrentSong} from './current-song';

@Component({
  selector: 'current-song',
  template: `
    <div id="current-song-div">
      <div id="current-song-artist">{{ currentSong.artist }}</div>
      -
      <div id="current-song-title">{{ currentSong.title }}</div>
      <div id="current-song-file">{{ currentSong.file }}</div>
    </div>`
})
export class CurrentSongComponent {
  @Input() currentSong = CurrentSong.createEmpty();
}


