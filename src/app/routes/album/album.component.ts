import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album.class';
import { Song } from 'src/app/models/song.class';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
})
export class AlbumComponent implements OnInit {
  albumId: string;
  album: Album | undefined;
  songs: Song[] = [];

  constructor(
    private spotify: SpotifyService,
    public router: Router,
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

    document.title = `${this.album.name} - Album - Spotify`;
  }
}
