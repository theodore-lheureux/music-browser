import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FavoritesService } from './services/favorites.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  searchbarShown = { isShown: false };

  constructor(
    public translator: TranslateService,
    private favorites: FavoritesService
  ) {}

  ngOnInit(): void {
    this.searchbarShown = this.favorites.searchbarShown;
  }
}
