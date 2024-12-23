import {Component, EventEmitter, input, Input, InputSignal, OnInit, Output, ViewContainerRef} from '@angular/core';
import {SeekInfo} from './seek.info';
import {TimeFormatPipe} from './time-format.pipe';
import {MusicService} from './music.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable, retry, tap, timer} from 'rxjs';
import {Item} from './item';
import {Tag} from './tag';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'tag-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="dialog">
      <div class="dialog-header">Tagy</div>
      <form [formGroup]="dialogForm" (ngSubmit)="saveTags()">
        <div class="dialog-fields">
          <label for="tag-title-input">Title</label>
          <input id="tag-title-input" autocomplete="do-not-autofill" type="text" formControlName="title">

          <label for="tag-artist-input">Artist</label>
          <input id="tag-artist-input" autocomplete="do-not-autofill" type="text" formControlName="artist"/>

          <label for="tag-album-input">Album</label>
          <input id="tag-album-input" autocomplete="do-not-autofill" type="text" formControlName="album"/>

          <label for="tag-year-input">Year</label>
          <input id="tag-year-input" autocomplete="do-not-autofill" type="text" formControlName="year"/>

          <label for="tag-composer-input">Composer</label>
          <input id="tag-composer-input" autocomplete="do-not-autofill" type="text" formControlName="composer"/>

          <label for="tag-track-input">Track</label>
          <input id="tag-track-input" autocomplete="do-not-autofill" type="text" formControlName="track"/>
        </div>
        <div class="dialog-buttons">
          <button type="submit">Uložit</button>
          <button (click)="close()">Storno</button>
        </div>
      </form>
    </div>
  `
})
export class TagDialogComponent implements OnInit {
  @Input() id = 0;

  public viewParent: ViewContainerRef | null = null;

  dialogForm = new FormGroup({
    title: new FormControl(''),
    artist: new FormControl(''),
    album: new FormControl(''),
    year: new FormControl(''),
    track: new FormControl(''),
    composer: new FormControl('')
  });

  constructor(private musicService: MusicService) {
  }

  ngOnInit(): void {
    this.musicService.readTag(this.id).pipe(
      retry({
        delay: (_) => {
          return timer(2000);
        }
      })).subscribe(tag => {
      this.dialogForm.setValue(
        {
          title: tag.title,
          artist: tag.artist,
          album: tag.album,
          year: tag.year,
          track: tag.track,
          composer: tag.composer
        });
    });
  }

  close() {
    this.viewParent?.clear()
  }

  saveTags() {
    const val = this.dialogForm.value;
    // undefinedToNull
    const u2n = (val: string | null | undefined) => val ? val : "";
    const tag = new Tag(u2n(val.title), u2n(val.artist), u2n(val.album), u2n(val.year), u2n(val.track), u2n(val.composer));
    this.musicService.writeTag(this.id, tag).subscribe({
      next: _ => {
        this.close();
      }, error: _ => {
        alert("Nezdařilo se zapsat úpravy tagů");
      }
    });
  }
}
