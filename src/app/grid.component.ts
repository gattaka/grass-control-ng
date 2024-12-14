import {Component, Input} from '@angular/core';

@Component({
  selector: 'grid',
  template: `
    <div>
      @for (st of items; track st) {
        <div>{{ st }}</div>
      }
    </div>`,
})
export class GridComponent {
  @Input() items: string[] = new Array();
}


