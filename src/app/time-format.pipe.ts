import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(timeInSec: number): string {
    if (timeInSec == -1) return "n/a";
    let minutes = Math.floor(timeInSec / 60);
    let seconds = timeInSec % 60;
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
}
