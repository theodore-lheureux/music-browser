import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-picker',
  templateUrl: './language-picker.component.html',
})
export class LanguagePickerComponent {
  open = false;

  constructor(private translator: TranslateService) {}

  toggle() {
    this.open = !this.open;
  }

  selectEN() {
    this.translator.use('en');
  }

  selectFR() {
    this.translator.use('fr');
  }
}
