import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';
import { FavoritesService } from './favorites.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchbarShown = { value: false };
  private currentArtist: Artist | undefined;
  private artistList: Artist[] = [];
  private artistListChangedSource$ = new Subject<Artist[]>();

  public artistListChanged$ = this.artistListChangedSource$.asObservable();

  constructor(private favorites: FavoritesService) {
    this.fillArtistList();

    this.favorites.favoritesChanged$.subscribe(() => {
      if (this.currentArtist) this.setCurrentArtist(this.currentArtist);
      else this.fillArtistList();
    });
  }

  private fillArtistList(): void {
    this.artistList = [];
    for (const artist of this.favorites.getFavorites()) {
      this.artistList.push(artist);
    }
    this.artistListChangedSource$.next(this.artistList);
  }

  public getArtistList(): Artist[] {
    return this.artistList;
  }

  public getCurrentArtist(): Artist | undefined {
    return this.currentArtist;
  }

  public setCurrentArtist(currentArtist: Artist | undefined): void {
    this.currentArtist = currentArtist;
    this.fillArtistList();

    if (!currentArtist) return;

    this.artistList.unshift(currentArtist);

    for (let i = 1; i < this.artistList.length; i++) {
      this.artistList[i].selected = false;
      if (this.artistList[i].id === currentArtist.id) {
        this.artistList.splice(i, 1);
        break;
      }
    }

    this.artistList[0].selected = true;

    this.artistListChangedSource$.next(this.artistList);
  }
}
