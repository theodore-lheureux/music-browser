import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styles: [],
})
export class SearchButtonComponent {
  faMagnifyingGlass = faMagnifyingGlass;

  constructor(public search: SearchService) {}

  showSearchbar(): void {
    this.search.searchbarShown.value = true;
  }
}
