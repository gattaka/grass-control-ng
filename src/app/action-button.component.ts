import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Item} from './Item';

@Component({
  selector: 'action-button',
  template: '<button (click)="onBtn()">{{value}}</button>',
})
export class ActionButtonComponent {
  @Output() btnEvent = new EventEmitter<Item>();
  @Input() value = "";

  onBtn() {
    const num = Math.random();
    this.btnEvent.emit(new Item("Child" + num, "childpath", "Parent", "parentPath"));
  }
}


