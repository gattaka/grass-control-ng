import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from './item';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {MusicService} from './music.service';
import {ControlsInfo} from './controls.info';

@Component({
  selector: 'controls',
  template: `
    <div class="controls-div">
      <button id="play-pause-btn" class="{{controlsInfo.isPlaying() ? 'pause-btn' : 'play-btn'}}"
              (click)="onPlayPause()"></button>
      <button id="prev-btn" (click)="onPrevious()"></button>
      <button id="stop-btn" (click)="onStop()"></button>
      <button id="next-btn" (click)="onNext()"></button>
      <button id="loop-btn" (click)="onLoop()" class="{{controlsInfo.loop ? 'checked' : ''}}"></button>
      <button id="shuffle-btn" (click)="onRandom()" class="{{controlsInfo.random ? 'checked' : ''}}"></button>
      <div id="volume-div">
        <input type="range" id="volume-slider"
               (change)="volumeControlChange($event)"
               max="256" min="0" value="{{controlsInfo.volume}}">
        <span id="volume-span">{{ controlsInfo.volumePerc }}%</span>
      </div>
    </div>`
})
export class ControlsComponent implements OnInit {
  @Input() controlsInfo = ControlsInfo.createEmpty();

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    const element = document.getElementById("volume-slider");
    if (element)
      element.addEventListener('wheel', (e) => {
        this.volumeControlScroll(e);
      }, {passive: false});
  }

  onPlayPause() {
    if (this.controlsInfo.isPlaying()) {
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

  volumeControlScroll(event: WheelEvent) {
    let slider: any = event.target;
    let newVal = Number(slider.value) + Math.sign(-event.deltaY) * 5;
    slider.value = newVal;
    this.musicService.volume(newVal);
  }

  volumeControlChange(event: Event) {
    let slider: any = event.target;
    this.musicService.volume(slider.value);
  }
}
