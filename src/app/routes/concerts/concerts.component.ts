import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.class';
import { BandsintownService } from 'src/app/services/bandsintown.service';
import { SearchService } from 'src/app/services/search.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ConcertResponse } from '../../services/bandsintown.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
@Component({
  selector: 'app-concerts',
  templateUrl: './concerts.component.html',
  styleUrls: ['./concerts.component.scss'],
})
export class ConcertsComponent implements OnInit, OnDestroy {
  artistId: string;
  artist: Artist | undefined;
  concerts: ConcertResponse[] | undefined;
  googleMapsURL: string | undefined;
  markerPositions: google.maps.LatLngLiteral[] = [];
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 2;
  locale: string | undefined;

  constructor(
    public spotify: SpotifyService,
    public bandsintown: BandsintownService,
    private translate: TranslateService,
    private search: SearchService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.artistId = route.snapshot.params['id'];

    registerLocaleData(localeFr, 'fr');

    router.events.subscribe(() => {
      const newId = route.snapshot.params['id'];
      if (newId !== this.artistId) {
        this.artistId = newId;
        this.ngOnInit();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.locale = this.translate.currentLang;

    this.translate.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) => {
        this.locale = langChangeEvent.lang;
      }
    );

    this.artist = await this.spotify.getArtistById(this.artistId);

    if (!this.artist) {
      this.router.navigate(['/page-not-found']);
      return;
    }
    document.title = 'Concerts of ' + this.artist.name + ' - Spotify';

    this.search.setCurrentArtist(this.artist);

    this.concerts = await this.bandsintown.getConcerts(this.artist.name);

    if (this.concerts.length > 0) {
      this.markerPositions = this.concerts.map((concert) => ({
        lat: +concert.venue.latitude,
        lng: +concert.venue.longitude,
      }));
      console.log(this.markerPositions);
    }
  }

  ngOnDestroy(): void {
    this.translate.onLangChange.unsubscribe();

    this.search.setCurrentArtist(undefined);
  }
}
