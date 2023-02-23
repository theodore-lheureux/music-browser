import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private favorites: Artist[] = [];
  searchbarShown = { isShown: false };

  currentArtist: Artist | undefined;

  getFavorites(): Artist[] {
    return this.favorites;
  }

  addFavorite(artist: Artist): void {
    this.favorites.push(artist);
  }

  removeFavorite(artist: Artist): void {
    const index = this.favorites.indexOf(artist);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }
}
