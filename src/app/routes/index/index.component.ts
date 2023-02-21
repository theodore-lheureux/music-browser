import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  constructor(private spotify: SpotifyService) {}

  ngOnInit(): void {
    this.spotify.getArtists('pink', 10).then((artists) => {
      console.log(artists);
    });
  }
}
