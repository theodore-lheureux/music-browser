import { Component, Input, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Artist } from 'src/app/models/artist.class';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  favoritesList: Artist[] = [];

  @Input() currentArtist: Artist | undefined;

  constructor(public favorites: FavoritesService) {}

  async ngOnInit(): Promise<void> {
    this.favoritesList = this.favorites.getFavorites();
  }

  addToFavorites(artist: Artist): void {
    this.favorites.addFavorite(artist);
  }

  showSearchbar(): void {
    this.favorites.searchbarShown.isShown = true;
  }
}
