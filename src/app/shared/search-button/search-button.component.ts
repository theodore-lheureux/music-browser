import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styles: [],
})
export class SearchButtonComponent {
  faMagnifyingGlass = faMagnifyingGlass;

  constructor(public favorites: FavoritesService) {}

  showSearchbar(): void {
    this.favorites.searchbarShown.isShown = true;
  }
}
