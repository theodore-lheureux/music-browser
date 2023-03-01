import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from './interceptors/cache-interceptor';
import { CacheResolverService } from './services/cache-resolver.service';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LanguagePickerComponent } from './layout/language-picker/language-picker.component';
import { IndexComponent } from './routes/index/index.component';
import { SearchbarComponent } from './shared/searchbar/searchbar.component';
import { ArtistCardComponent } from './shared/artist-card/artist-card.component';
import { FormsModule } from '@angular/forms';
import { AsideComponent } from './layout/aside/aside.component';
import { ArtistComponent } from './routes/artist/artist.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { AlbumCardComponent } from './shared/album-card/album-card.component';
import { SearchButtonComponent } from './shared/search-button/search-button.component';
import { AlbumComponent } from './routes/album/album.component';
import { SongCardComponent } from './shared/song-card/song-card.component';
import { SafePipe } from './pipes/safe.pipe';
import { ConcertsComponent } from './routes/concerts/concerts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    LanguagePickerComponent,
    IndexComponent,
    ArtistComponent,
    SearchbarComponent,
    ArtistCardComponent,
    AsideComponent,
    PageNotFoundComponent,
    AlbumCardComponent,
    SearchButtonComponent,
    AlbumComponent,
    SongCardComponent,
    SafePipe,
    ConcertsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [
    CacheResolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
