import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: Artist[] = JSON.parse(
    localStorage.getItem('favorites') ?? '[]'
  );
  private favoritesChangedSource$ = new Subject<Artist[]>();

  public favoritesChanged$ = this.favoritesChangedSource$.asObservable();

  getFavorites(): Artist[] {
    return this.favorites;
  }

  addFavorite(artist: Artist): void {
    if (this.isFavorite(artist.id)) return;

    const copy: Artist = { ...artist };
    copy.selected = false;

    this.favorites.push(copy);

    localStorage.setItem('favorites', JSON.stringify(this.favorites));

    this.favoritesChangedSource$.next(this.favorites);
  }

  removeFavorite(artist: Artist): void {
    for (let i = 0; i < this.favorites.length; i++) {
      if (this.favorites[i].id === artist.id) {
        this.favorites.splice(i, 1);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.favoritesChangedSource$.next(this.favorites);
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
