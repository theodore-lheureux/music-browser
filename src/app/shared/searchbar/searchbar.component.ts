import {
  Component,
  HostListener,
  AfterViewChecked,
  ViewChildren,
  AfterViewInit,
  OnInit,
  QueryList,
  ElementRef,
} from '@angular/core';
import {
  faCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { Artist } from '../../models/artist.class';
import { SpotifyService } from 'src/app/services/spotify.service';
import { SearchService } from 'src/app/services/search.service';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  animations: [
    trigger('bgAnimation', [
      transition('false => true', [
        group([
          query('.searchbar', [
            animate('300ms ease-in-out'),
            style({ transform: 'translateY(-112%)' }),
          ]),
          query(':self', [
            animate('300ms ease-in-out'),
            style({ backdropFilter: 'blur(4px) brightness(0.75) opacity(0)' }),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class SearchbarComponent
  implements AfterViewChecked, AfterViewInit, OnInit
{
  faMagnifyingGlass = faMagnifyingGlass;
  faCircleXmark = faCircleXmark;
  @ViewChildren('searchInput') searchInputElement!: QueryList<ElementRef>;
  searchValue = '';
  loading = false;
  hide = false;
  selectedIndex = -1;
  lastKeyDown = 0;
  recentArtists: Artist[];
  artists: Artist[];

  constructor(
    private spotify: SpotifyService,
    private searchService: SearchService,
    public router: Router
  ) {
    this.recentArtists = JSON.parse(
      window.localStorage.getItem('recentSearches') ?? '[]'
    );
    this.artists = this.recentArtists;
  }

  ngAfterViewChecked(): void {
    this.scrollToSelected();
  }

  ngOnInit(): void {
    this.selectFirstOrNone();
  }

  ngAfterViewInit(): void {
    this.searchInputElement.first.nativeElement.focus();
  }

  async search() {
    if (this.searchValue.length <= 2) {
      this.artists = this.recentArtists;
      return;
    }

    this.loading = true;
    this.artists = await this.spotify.getArtists(this.searchValue);
    this.loading = false;

    this.selectFirstOrNone();
  }

  async submit() {
    if (this.selectedIndex === -1) {
      this.closeSearch();
      return;
    }

    this.recentArtists = this.recentArtists.filter(
      (artist) => artist.name !== this.artists[this.selectedIndex].name
    );
    this.recentArtists.unshift(this.artists[this.selectedIndex]);
    this.recentArtists = this.recentArtists.slice(0, 10);

    window.localStorage.setItem(
      'recentSearches',
      JSON.stringify(this.recentArtists)
    );

    this.router.navigate(['/artist', this.artists[this.selectedIndex].id]);

    this.closeSearch();
  }

  deleteRecent(artist: Artist) {
    this.recentArtists = this.recentArtists.filter(
      (a) => a.name !== artist.name
    );
    window.localStorage.setItem(
      'recentSearches',
      JSON.stringify(this.recentArtists)
    );
    this.artists = this.recentArtists;
  }

  closeSearch() {
    this.hide = true;
  }

  animationDone() {
    if (this.hide) this.searchService.searchbarShown.value = false;
  }

  bgClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closeSearch();
  }

  scrollToSelected() {
    const selected = document.querySelector('#searchbar > * .selectedArtist');
    if (selected && Date.now() - this.lastKeyDown < 150)
      selected.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    else if (selected)
      selected.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest',
      });
  }

  selectIndex(index: number) {
    this.selectedIndex = index;
    this.artists.forEach((artist) => (artist.selected = false));
    this.artists[index].selected = true;
  }

  selectArtist(artist: Artist) {
    this.selectedIndex = this.artists.indexOf(artist);
    this.selectIndex(this.selectedIndex);
  }

  selectFirstOrNone() {
    if (this.artists.length > 0) this.selectIndex(0);
    else this.selectedIndex = -1;
  }

  selectLastOrNone() {
    if (this.artists.length > 0) this.selectIndex(this.artists.length - 1);
    else this.selectedIndex = -1;
  }

  selectPrevious() {
    if (this.selectedIndex <= 0) this.selectLastOrNone();
    else {
      this.selectedIndex--;
      this.selectIndex(this.selectedIndex);
    }
  }

  selectNext() {
    if (this.selectedIndex >= this.artists.length - 1) this.selectFirstOrNone();
    else {
      this.selectedIndex++;
      this.selectIndex(this.selectedIndex);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (Date.now() - this.lastKeyDown < 150) return;
    this.lastKeyDown = Date.now();

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectPrevious();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectNext();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.submit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeSearch();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        this.selectPrevious();
      } else {
        this.selectNext();
      }
    }
  }
}
