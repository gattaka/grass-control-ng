import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SeekInfo} from './seek.info';
import {Utils} from './utils';
import {MusicService} from './music.service';

@Component({
  selector: 'seek-bar',
  template: `
    <div id="progress-div">
      <span id="progress-time-span">{{ Utils.formatTime(seekInfo.currentSecs) }}</span>
      <input type="range" id="progress-slider"
             (change)="seekChange($event)"
             (wheel)="seekScroll($event)" min="0"
             max="{{seekInfo.totalSecs}}" value="{{ seekInfo.currentSecs }}"/>
      <span id="progress-length-span">{{ Utils.formatTime(seekInfo.totalSecs) }}</span>
    </div>`
})
export class SeekBarComponent {
  @Input() seekInfo = SeekInfo.createEmpty();
  protected readonly Utils = Utils;

  constructor(private musicService: MusicService) {
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
