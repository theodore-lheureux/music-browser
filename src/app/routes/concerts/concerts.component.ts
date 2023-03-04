import {
  AfterContentChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
export class ConcertsComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  artistId: string;
  artist: Artist | undefined;
  concerts: ConcertResponse[] | undefined;
  googleMapsURL: string | undefined;
  markerPositions: google.maps.LatLngLiteral[] = [];
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 2;
  locale: string | undefined;
  @ViewChildren('map') mapElement!: QueryList<ElementRef>;

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
    }
  }

  ngOnDestroy(): void {
    this.search.setCurrentArtist(undefined);
  }

  ngAfterContentChecked(): void {
    if (this.markerPositions.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.markerPositions.forEach((position) => {
        bounds.extend(position);
      });

      const newCenter = bounds.getCenter().toJSON();

      if (
        this.center.lat !== newCenter.lat ||
        this.center.lng !== newCenter.lng
      ) {
        this.center = newCenter;
      }
    }

    if (this.mapElement === undefined) return;

    const map = this.mapElement.first?.nativeElement;
    if (map !== undefined) {
      const mapHeight = map.clientHeight;
      const mapBounds = new google.maps.LatLngBounds();

      this.markerPositions.forEach((position) => {
        mapBounds.extend(position);
      });

      const zoomLevel = this.getZoom(mapHeight, mapBounds);

      if (zoomLevel !== this.zoom) this.zoom = zoomLevel;
    }
  }

  private getZoom(
    mapHeight: number,
    mapBounds: google.maps.LatLngBounds
  ): number {
    function latitudeToRad(lat: number): number {
      const sin = Math.sin((lat * Math.PI) / 180);
      const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    const neBound = mapBounds.getNorthEast();
    const swBound = mapBounds.getSouthWest();

    const latFraction =
      (latitudeToRad(neBound.lat()) - latitudeToRad(swBound.lat())) / Math.PI;
    const latZoom = Math.round(
      Math.log(mapHeight / 256 / latFraction) / Math.LN2
    );
    const zoomLvl = Math.min(latZoom, 15);

    return zoomLvl > 2 ? zoomLvl - 1 : 1;
  }
}
