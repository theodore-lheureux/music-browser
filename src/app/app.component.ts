import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  searchbarShown = { value: false };

  constructor(
    public translator: TranslateService,
    private search: SearchService
  ) {}

  ngOnInit(): void {
    this.searchbarShown = this.search.searchbarShown;
  }
}
