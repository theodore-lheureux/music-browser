import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album.class';
import { Artist } from 'src/app/models/artist.class';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
})
export class ArtistComponent implements OnInit {
  artistId: string;
  artist: Artist | undefined;
  albums: Album[] = [];

  constructor(
    private spotify: SpotifyService,
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

    await this.fillAlbums();
  }

  async fillAlbums(): Promise<void> {
    this.albums = await this.spotify.getArtistAlbums(this.artistId, 50, 0);

    // sort albums by release date
    this.albums.sort((a, b) => {
      if (a.releaseDate > b.releaseDate) return 1;
      if (a.releaseDate < b.releaseDate) return -1;
      return 0;
    });
  }
}
