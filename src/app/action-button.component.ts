import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'action-button',
  template: '<button (click)="onBtn()">TEST Btn</button>',
})
export class ActionButtonComponent {
  @Output() btnEvent = new EventEmitter<string>();

  onBtn() {
    this.btnEvent.emit("hellooo");
  }
}


