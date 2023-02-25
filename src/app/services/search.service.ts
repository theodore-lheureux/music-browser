import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchbarShown = { value: false };
  currentArtist: Artist | undefined;
}
