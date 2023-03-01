import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.class';
import { BandsintownService } from 'src/app/services/bandsintown.service';
import { SearchService } from 'src/app/services/search.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ConcertResponse } from '../../services/bandsintown.service';
import { googleAPIKey } from 'src/app/app.config';

const apiURL = 'https://www.google.com/maps/embed/v1/';

@Component({
  selector: 'app-concerts',
  templateUrl: './concerts.component.html',
})
export class ConcertsComponent implements OnInit, OnDestroy {
  artistId: string;
  artist: Artist | undefined;
  concerts: ConcertResponse[] | undefined;
  googleMapsURL: string | undefined;

  constructor(
    public spotify: SpotifyService,
    public bandsintown: BandsintownService,
    private search: SearchService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.artistId = route.snapshot.params['id'];

    router.events.subscribe(() => {
      const newId = route.snapshot.params['id'];
      if (newId !== this.artistId) {
        this.artistId = newId;
        this.ngOnInit();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.artist = await this.spotify.getArtistById(this.artistId);

    if (!this.artist) {
      this.router.navigate(['/page-not-found']);
      return;
    }
    document.title = 'Concerts of ' + this.artist.name + ' - Spotify';

    this.search.setCurrentArtist(this.artist);

    this.concerts = await this.bandsintown.getConcerts(this.artist.name);

    this.googleMapsURL = `${apiURL}place?key=${googleAPIKey}&q=${this.concerts[0].venue.latitude},${this.concerts[0].venue.longitude}`;
  }

  ngOnDestroy(): void {
    this.search.setCurrentArtist(undefined);
  }
}
