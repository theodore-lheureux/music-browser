import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string | SafeValue | null) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sanitizer.sanitize(SecurityContext.URL, url) ?? ''
    );
  }
}
