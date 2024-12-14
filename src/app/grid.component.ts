import {Component, Input} from '@angular/core';
import {Item} from './Item';
import {ActionButtonComponent} from './action-button.component';

@Component({
  selector: 'grid',
  template: `
    <div class="table-div" id="library-table">
      <div class="table-head-div">
        <div class="table-head-tr-div">
          <div class="table-head-td-div" style="width:50%;">Název</div>
          <div class="table-head-td-div" style="width:50%;">Nadřazený adresář</div>
        </div>
      </div>
      <div class="table-body-div">
        @for (item of items; track item.name) {
          <div class="table-body-tr-div">
            <div class="table-body-td-div" style="width:50%;">
              <div class="control-buttons-div">
                <action-button value="⏵"/>
                <action-button value="+"/>
              </div>
              <action-button value="{{item.name}}"/>
            </div>
            <div class="table-body-td-div" style="width:50%;">
              <div class="control-buttons-div">
                <action-button value="⏵"/>
                <action-button value="+"/>
                <action-button value="{{item.parentName}}"/>
              </div>
            </div>
          </div>
        }
      </div>
    </div>`,
  imports: [
    ActionButtonComponent
  ]
})
export class GridComponent {
  @Input() items: Item[] = new Array();
}


