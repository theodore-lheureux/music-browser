import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ArtistService } from './services/artist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  searchbarShown = { isShown: false };

  constructor(
    public translator: TranslateService,
    private artistService: ArtistService
  ) {}

  ngOnInit(): void {
    this.searchbarShown = this.artistService.searchbarShown;
  }
}
