import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Item} from './Item';

@Component({
  selector: 'action-button',
  template: '<button (click)="onBtn()">{{label}}</button>',
})
export class ActionButtonComponent {
  @Output() btnEvent = new EventEmitter<Item>();
  @Input() item!: Item;
  @Input() label = "";

  onBtn() {
    this.btnEvent.emit(this.item);
  }
}


