import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Artist } from 'src/app/models/artist.class';
import { FavoritesService } from 'src/app/services/favorites.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  favoritesList: Artist[] = [];

  constructor(
    private spotify: SpotifyService,
    public favorites: FavoritesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.favoritesList = this.favorites.getFavorites();

    const a = await this.spotify.getArtist('Pink Floyd');
    console.log(a);
    if (a) this.addToFavorites(a);
  }

  addToFavorites(artist: Artist): void {
    this.favorites.addFavorite(artist);
  }

  showSearchbar(): void {
    this.favorites.searchbarShown.isShown = true;
  }
}
