export class SeekInfo {

  totalSecs = 0;
  currentSecs = 0;

  static createEmpty() {
    return new SeekInfo(0, 0);
  }

  static create(totalSecs: number, currentSecs: number) {
    return new SeekInfo(totalSecs, currentSecs);
  }

  private constructor(totalSecs: number, currentSecs: number) {
    this.totalSecs = totalSecs;
    this.currentSecs = currentSecs;
  }
}
