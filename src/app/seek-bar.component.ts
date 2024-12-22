import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SeekInfo} from './seek.info';
import {TimeFormatPipe} from './time-format.pipe';
import {MusicService} from './music.service';

@Component({
  selector: 'seek-bar',
  imports: [
    TimeFormatPipe
  ],
  template: `
    <div id="progress-div">
      <span id="progress-time-span">{{ seekInfo.currentSecs | timeFormat }}</span>
      <input type="range" id="progress-slider"
             (change)="seekChange($event)"
             min="0" max="{{seekInfo.totalSecs}}" value="{{ seekInfo.currentSecs }}"/>
      <span id="progress-length-span">{{ seekInfo.totalSecs | timeFormat }}</span>
    </div>`
})
export class SeekBarComponent implements OnInit {
  @Input() seekInfo = SeekInfo.createEmpty();
  protected readonly Utils = TimeFormatPipe;

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    const element = document.getElementById("progress-slider");
    if (element)
      element.addEventListener('wheel', (e) => {
        this.seekScroll(e);
      }, {passive: false});
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
