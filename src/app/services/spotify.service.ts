import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private apiURL = 'https://api.spotify.com/v1';
  private clientId = 'a9854cdb42a149d1b0d00332116be018';
  private clientSecret = 'fa4018e789ff4bf59d3df7bcf5b4025f';
  private token: string | undefined;

  constructor(private http: HttpClient) {}

  public async getArtists(query: string, limit: number): Promise<Artist[]> {
    const response = await this.executeRequest<ArtistsResponse>(() =>
      this.http.get<ArtistsResponse>(
        `${this.apiURL}/search?q=${query}&type=artist&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
    );

    if (!response) return [];

    return response.artists.items.map((artist) => {
      return new Artist(
        artist.name,
        artist.id,
        artist.popularity,
        artist.images[0]?.url
      );
    });
  }

  private async authorize(): Promise<boolean> {
    let response: { access_token: string };

    try {
      response = await firstValueFrom(
        this.http.post<{ access_token: string }>(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({
            grant_type: 'client_credentials',
          }),
          {
            headers: {
              Authorization: `Basic ${window.btoa(
                `${this.clientId}:${this.clientSecret}`
              )}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
      );
    } catch (e) {
      console.error(e);
      return false;
    }

    if (response != null) {
      if (response.access_token != null) {
        this.token = response.access_token;
        return true;
      }
    }

    return false;
  }

  private async executeRequest<T>(request: Request<T>): Promise<T | undefined> {
    if (this.token == null) {
      const authorized = await this.authorize();
      if (!authorized) return undefined;
    }

    return firstValueFrom(request()).catch((e) => {
      console.error(e);
      return undefined;
    });
  }
}

type Request<T> = () => Observable<T>;

interface ArtistsResponse {
  artists: {
    items: {
      name: string;
      id: string;
      popularity: number;
      images: {
        url: string;
      }[];
    }[];
  };
}
