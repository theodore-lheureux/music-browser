import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: Artist[] = [];
  searchbarShown = { isShown: false };

  currentArtist: Artist | undefined;

  getFavorites(): Artist[] {
    return this.favorites;
  }

  addFavorite(artist: Artist): void {
    if (this.isFavorite(artist.id)) return;

    artist.selected = false;
    this.favorites.push(artist);
  }

  removeFavorite(artist: Artist): void {
    for (let i = 0; i < this.favorites.length; i++) {
      if (this.favorites[i].id === artist.id) {
        this.favorites.splice(i, 1);
        return;
      }
    }
  }

  isFavorite(id: string): boolean {
    for (const artist of this.favorites) {
      if (artist.id === id) return true;
    }
    return false;
  }
}
