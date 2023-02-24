import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  faStar as faStarSolid,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { Artist } from 'src/app/models/artist.class';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
})
export class ArtistCardComponent {
  faXmark = faXmark;
  faStarSolid = faStarSolid;
  faStarRegular = faStarRegular;
  @Input() artist!: Artist;
  @Input() deletable = false;
  @Input() selectable = true;
  @Input() imgSize = 12;
  @Input() padding = 4;
  @Input() textSize = 'lg';
  @Input() imgRoundness = 'md';
  @Input() showStar = true;
  @Input() backgroundColor = 'bg-tertiary';

  @Output() deleteEvent = new EventEmitter<Artist>();

  constructor(private favorites: FavoritesService) {}

  deleteArtist(): void {
    this.deleteEvent.emit(this.artist);
  }

  isFavorite(): boolean {
    return this.favorites.isFavorite(this.artist.id);
  }

  toggleFavorite(): void {
    if (this.isFavorite()) this.favorites.removeFavorite(this.artist);
    else this.favorites.addFavorite(this.artist);
  }
}
