import { Component, Input } from '@angular/core';
import { Song } from 'src/app/models/song.class';

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styles: [],
})
export class SongCardComponent {
  @Input() song!: Song;
}
