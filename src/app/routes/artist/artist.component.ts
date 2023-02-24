import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.class';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
})
export class ArtistComponent implements OnInit {
  artistId: string;
  artist: Artist | undefined;

  constructor(
    private spotify: SpotifyService,
    route: ActivatedRoute,
    public router: Router
  ) {
    this.artistId = route.snapshot.params['id'];
  }

  async ngOnInit(): Promise<void> {
    this.artist = await this.spotify.getArtistById(this.artistId);

    if (!this.artist) {
      this.router.navigate(['/page-not-found']);
      return;
    }
  }
}
