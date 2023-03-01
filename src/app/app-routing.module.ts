import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './routes/index/index.component';
import { ArtistComponent } from './routes/artist/artist.component';
import { AlbumComponent } from './routes/album/album.component';
import { ConcertsComponent } from './routes/concerts/concerts.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'index',
    component: IndexComponent,
    data: { animation: 'index' },
  },
  {
    path: 'artist/:id',
    component: ArtistComponent,
    data: { animation: 'artist' },
  },
  {
    path: 'album/:id',
    component: AlbumComponent,
    data: { animation: 'album' },
  },
  {
    path: 'concerts/:id',
    component: ConcertsComponent,
    data: { animation: 'concerts' },
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { animation: 'pageNotFound' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
