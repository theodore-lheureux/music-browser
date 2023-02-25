import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from './services/search.service';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [routeAnimations],
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

  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRouteData['animation'];
  }
}
