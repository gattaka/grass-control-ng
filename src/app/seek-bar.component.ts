import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SeekInfo} from './seek.info';
import {Utils} from './utils';

@Component({
  selector: 'seek-bar',
  template: `
    <div id="progress-div">
      <span id="progress-time-span">{{ Utils.formatTime(seekInfo.currentSecs) }}</span>
      <input type="range" id="progress-slider"
             (change)="seekChange.emit($event)"
             (wheel)="seekScroll.emit($event)" min="0"
             max="{{seekInfo.totalSecs}}" value="{{ seekInfo.currentSecs }}"/>
      <span id="progress-length-span">{{ Utils.formatTime(seekInfo.totalSecs) }}</span>
    </div>`
})
export class SeekBarComponent {
  @Output() seekChange = new EventEmitter();
  @Output() seekScroll = new EventEmitter();
  @Input() seekInfo = SeekInfo.createEmpty();
  protected readonly Utils = Utils;
}
