import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Artist } from 'src/app/models/artist.class';
import { ArtistService } from 'src/app/services/artist.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  favorites: Artist[] = [];

  constructor(
    private spotify: SpotifyService,
    private artistService: ArtistService
  ) {}

  async ngOnInit(): Promise<void> {
    this.favorites = this.artistService.getFavorites();
    this.addToFavorites((await this.spotify.getArtists('pink floyd', 1))[0]);

    console.log(this.favorites);
  }

  addToFavorites(artist: Artist): void {
    this.artistService.addFavorite(artist);
  }

  showSearchbar(): void {
    this.artistService.searchbarShown.isShown = true;
  }
}
