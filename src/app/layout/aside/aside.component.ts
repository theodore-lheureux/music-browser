import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Artist } from 'src/app/models/artist.class';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  artistList: Artist[] = [];

  constructor(private search: SearchService) {}

  async ngOnInit(): Promise<void> {
    this.artistList = await this.search.getArtistList();
    this.search.artistListChanged$.subscribe((artistList) => {
      this.artistList = artistList;
    });
  }
}
