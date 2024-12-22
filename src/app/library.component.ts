import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from './item';
import {ActionButtonComponent} from './action-button.component';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MusicService} from './music.service';
import {catchError, defer, delay, delayWhen, Observable, of, retry, retryWhen, tap, throwError, timer} from 'rxjs';

@Component({
  selector: 'library',
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="search()">
      <div id="search-div">
        <input id="search-input" autocomplete="do-not-autofill" type="text" formControlName="searchPhrase"/>
        <button type="submit">Vyhledat</button>
      </div>
    </form>
    @if (itemsObs | async; as items) {
      <div class="table-div" id="library-table">
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
                  <action-button [item]=item label="⏵" (click)="enqueAndPlay(item)"/>
                  <action-button [item]=item label="+" (click)="enque(item)"/>
                  <action-button [item]=item (click)="openParentDir(item)" label="⮭"/>
                </div>
                <div class="item-div">
                  @if (item.directory) {
                    <div class="name-div" (click)="openDir(item)">[{{ item.name }}]</div>
                  } @else {
                    <div class="name-div" (click)="enqueAndPlay(item)">{{ item.name }}</div>
                  }
                  <div class="dir-info" (click)="openCurrentDir(item)">
                    @if (item.path == "") {
                      /
                    } @else {
                      {{ item.path }}
                    }</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <div id="library-unavailable-div">⚠️ Knihovna není dostupná</div>
    }`,
  imports: [
    ActionButtonComponent,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LibraryComponent implements OnInit {

  // ! = To avoid error, inform the compiler that this variable will never be undefined or null
  itemsObs!: Observable<Item[] | null>;

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.createItemObs(this.musicService.getRootItems());
  }

  private createItemObs(obs: Observable<Item[]>) {
    this.itemsObs = obs.pipe(
      retry({
        delay: (_) => {
          return timer(2000);
        }
      }));
  }

  searchForm = new FormGroup({
    searchPhrase: new FormControl('')
  });

  list(path = "") {
    this.createItemObs(this.musicService.getItems(path));
  }

  search() {
    const value = this.searchForm.value.searchPhrase;
    this.itemsObs = this.musicService.getItemsBySearch(value);
  }

  openParentDir(item: Item) {
    const lastIndex = item.path.lastIndexOf("/");
    console.log("item.path '" + item.path + "'");
    if (lastIndex > -1) {
      this.list(item.path.substring(0, lastIndex));
    } else {
      this.list("");
    }
  }

  openCurrentDir(item: Item) {
    this.list(item.path);
  }

  openDir(item: Item) {
    this.list(item.path + "/" + item.name);
  }

  enque(item: Item) {
    this.musicService.enqueue(item.path + "/" + item.name)
  }

  enqueAndPlay(item: Item) {
    this.musicService.enqueueAndPlay(item.path + "/" + item.name);
  }
}
