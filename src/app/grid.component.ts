import {Component, Input} from '@angular/core';
import {Item} from './Item';
import {ActionButtonComponent} from './action-button.component';

@Component({
  selector: 'grid',
  template: `
    <div class="table-head-div">
      <div class="table-head-tr-div">
        <div class="table-head-td-div">Název</div>
      </div>
    </div>
    <div class="table-body-div">
      @for (item of items; track item.name) {
        <div class="table-body-tr-div">
          <div class="table-body-td-div">
            <div class="control-buttons-div">
              <action-button [item]=item label="⏵"/>
              <action-button [item]=item label="+"/>
            </div>
            @if (item.directory) {
              <action-button [item]=item label="{{item.name}}"/>
            } @else {
              <div>{{ item.name }}</div>
            }
            <div class="dir-info">{{ item.path }}</div>
          </div>
        </div>
      }
    </div>`,
  imports: [
    ActionButtonComponent
  ]
})
export class GridComponent {
  @Input() items: Item[] = new Array();
}


