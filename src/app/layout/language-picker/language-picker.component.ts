import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  host: {
    '(document:click)': 'onClick($event)',
    '(document:keydown)': 'onKeydown($event)',
  },
  selector: 'app-language-picker',
  templateUrl: './language-picker.component.html',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        })
      ),
      state('closed', style({})),
      transition('open => closed', [animate(110)]),
      transition('closed => open', [animate(110)]),
    ]),
  ],
})
export class LanguagePickerComponent implements OnInit {
  open = false;
  menuOpen = false;
  currentLang = 'EN';
  faChevronRight = faChevronRight;
  faCheck = faCheck;

  constructor(private translator: TranslateService) {}

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('language') ?? 'EN';
    this.translator.use(this.currentLang.toLowerCase());
  }

  toggle() {
    this.open = !this.open;
  }

  selectEN() {
    this.translator.use('en');
    this.currentLang = 'EN';
    localStorage.setItem('language', 'EN');
  }

  selectFR() {
    this.translator.use('fr');
    this.currentLang = 'FR';
    localStorage.setItem('language', 'FR');
  }

  openCloseStart() {
    if (!this.open) {
      this.menuOpen = false;
    } else {
      this.menuOpen = true;
    }
  }

  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('#language-selector-button')) {
      this.open = false;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.open = false;
    }
  }
}
