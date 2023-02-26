import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album.class';
import { Artist } from 'src/app/models/artist.class';
import { SearchService } from 'src/app/services/search.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  animations: [
    trigger('child', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ filter: 'opacity(0%)', transform: 'none' }),
            stagger(70, [
              animate(
                '0.7s ease-in-out',
                style({ filter: 'none', transform: 'none' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ArtistComponent implements OnInit, OnDestroy {
  artistId: string;
  artist: Artist | undefined;
  albums: Album[] = [];

  constructor(
    private spotify: SpotifyService,
    private search: SearchService,
    route: ActivatedRoute,
    public router: Router
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
    document.title = this.artist.name + ' - Spotify';

    this.search.setCurrentArtist(this.artist);
    await this.fillAlbums();
  }

  ngOnDestroy(): void {
    this.search.setCurrentArtist(undefined);
  }

  async fillAlbums(): Promise<void> {
    this.albums = await this.spotify.getArtistAlbums(this.artistId, 50, 0);

    this.albums.sort((a, b) => {
      if (a.releaseDate > b.releaseDate) return 1;
      if (a.releaseDate < b.releaseDate) return -1;
      return 0;
    });
  }
}
