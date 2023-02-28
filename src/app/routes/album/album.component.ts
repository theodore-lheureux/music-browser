import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album.class';
import { Artist } from 'src/app/models/artist.class';
import { Song } from 'src/app/models/song.class';
import { SearchService } from 'src/app/services/search.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  albumId: string;
  album: Album | undefined;
  artist: Artist | undefined;
  songs: Song[] = [];
  videoUrl: string | undefined;

  constructor(
    private spotify: SpotifyService,
    public router: Router,
    public search: SearchService,
    public youtube: YoutubeService,
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

  async playSong(song: Song): Promise<void> {
    const video = await this.youtube.getSong(
      song.name,
      this.artist?.name ?? ''
    );

    if (!video) return;

    if (video.items.length > 0)
      this.videoUrl = `https://www.youtube.com/embed/${video.items[0].id.videoId}`;
  }

  bgClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.videoUrl = undefined;
  }
}
