import {SeekInfo} from './seek.info';
import {ControlsInfo} from './controls.info';
import {CurrentSong} from './current-song';

export class Status {

  currentSong: CurrentSong;
  seekInfo: SeekInfo;
  controlsInfo: ControlsInfo;

  static createEmpty() {
    return new Status(CurrentSong.createEmpty(), SeekInfo.createEmpty(), ControlsInfo.createEmpty())
  }

  static create(currentSong: CurrentSong, seekInfo: SeekInfo, controlsInfo: ControlsInfo) {
    return new Status(currentSong, seekInfo, controlsInfo);
  }

  private constructor(currentSong: CurrentSong, seekInfo: SeekInfo, controlsInfo: ControlsInfo) {
    this.currentSong = currentSong;
    this.seekInfo = seekInfo;
    this.controlsInfo = controlsInfo;
  }
}
