import { Component, Input } from '@angular/core';
import { Album } from 'src/app/models/album.class';

@Component({
  selector: 'app-album-card',
  templateUrl: './album-card.component.html',
})
export class AlbumCardComponent {
  @Input() album!: Album;
}
