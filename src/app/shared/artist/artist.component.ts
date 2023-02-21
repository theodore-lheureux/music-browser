import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Artist } from 'src/app/models/artist.class';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
})
export class ArtistComponent {
  faXmark = faXmark;
  @Input() artist!: Artist;
  @Input() deletable = false;
  @Output() deleteEvent = new EventEmitter<Artist>();

  deleteArtist(): void {
    this.deleteEvent.emit(this.artist);
  }
}
