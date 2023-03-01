import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { bandsInTownAPIKey } from '../app.config';

const apiURL = 'https://rest.bandsintown.com/';

@Injectable({
  providedIn: 'root',
})
export class BandsintownService {
  constructor(private http: HttpClient) {}

  async getConcerts(name: string): Promise<ConcertResponse[]> {
    const url = `${apiURL}artists/${name}/events?app_id=${bandsInTownAPIKey}`;
    const response = await lastValueFrom(this.http.get<ConcertResponse[]>(url));

    return response;
  }
}

export interface ConcertResponse {
  id: string;
  artist_id: string;
  url: string;
  on_sale_datetime: string;
  datetime: string;
  description: string;
  venue: {
    name: string;
    country: string;
    city: string;
    region: string;
    latitude: string;
    longitude: string;
  };
}
