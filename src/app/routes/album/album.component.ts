import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album.class';
import { Artist } from 'src/app/models/artist.class';
import { Song } from 'src/app/models/song.class';
import { SearchService } from 'src/app/services/search.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
})
export class AlbumComponent implements OnInit, OnDestroy {
  albumId: string;
  album: Album | undefined;
  artist: Artist | undefined;
  songs: Song[] = [];

  constructor(
    private spotify: SpotifyService,
    public router: Router,
    public search: SearchService,
    route: ActivatedRoute
  ) {
    this.albumId = route.snapshot.params['id'];

    router.events.subscribe(() => {
      const newId = route.snapshot.params['id'];
      if (newId !== this.albumId) {
        this.albumId = newId;
        this.ngOnInit();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.album = await this.spotify.getAlbum(this.albumId);

    if (!this.album) {
      this.router.navigate(['/page-not-found']);
      return;
    }

    this.songs = await this.spotify.getAlbumSongs(this.album);
    this.artist = await this.spotify.getArtistById(this.album.artistId);
    this.search.setCurrentArtist(this.artist);

    document.title = `${this.album.name} - ${this.artist?.name} - Spotify`;
  }

  ngOnDestroy(): void {
    this.search.setCurrentArtist(undefined);
  }
}
