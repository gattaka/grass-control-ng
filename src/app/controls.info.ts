export class ControlsInfo {

  state = ""
  random = false;
  loop = false;
  volume = 0;
  volumePerc = 0;

  static createEmpty() {
    return new ControlsInfo("", false, false, 0);
  }

  static create(state: string, random: boolean, loop: boolean, volume: number) {
    return new ControlsInfo(state, random, loop, volume);
  }

  private constructor(state: string, random: boolean, loop: boolean, volume: number) {
    this.state = state;
    this.random = random;
    this.loop = loop;
    this.volume = volume;
    this.volumePerc = Math.floor(volume / 256 * 100);
  }

  isPlaying() {
    return this.state == "playing";
  }
}
