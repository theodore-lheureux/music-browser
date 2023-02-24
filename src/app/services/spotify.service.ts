import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';
import { Observable, firstValueFrom } from 'rxjs';
import { clientId, clientSecret } from '../app.config';
import { Album } from '../models/album.class';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private apiURL = 'https://api.spotify.com/v1';
  private token: string | undefined;

  constructor(private http: HttpClient) {}

  public async getArtists(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<Artist[]> {
    const response = await this.executeRequest<ArtistsResponse>(() =>
      this.http.get<ArtistsResponse>(
        `${this.apiURL}/search?q=${query}&type=artist&limit=${limit}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      )
    );

    if (!response) return [];

    return response.artists.items.map((artist) => {
      return new Artist(
        artist.id,
        artist.name,
        artist.popularity,
        this.getImageUrl(artist.images),
        this.getImageUrlXL(artist.images)
      );
    });
  }

  public async getArtist(query: string): Promise<Artist | undefined> {
    return this.getArtists(query, 1).then((artists) => artists[0]);
  }

  public async getArtistById(id: string): Promise<Artist | undefined> {
    const response = await this.executeRequest<ArtistResponse>(() =>
      this.http.get<ArtistResponse>(`${this.apiURL}/artists/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
    );

    if (!response) return undefined;

    return new Artist(
      response.id,
      response.name,
      response.popularity,
      this.getImageUrl(response.images),
      this.getImageUrlXL(response.images)
    );
  }

  public async getArtistAlbums(
    id: string,
    limit = 20,
    offset = 0
  ): Promise<Album[]> {
    const response = await this.executeRequest<ArtistAlbumsResponse>(() =>
      this.http.get<ArtistAlbumsResponse>(
        `${this.apiURL}/artists/${id}/albums?limit=${limit}?offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      )
    );

    if (!response) return [];

    return response.items.map((album) => {
      return new Album(
        album.id,
        album.name,
        this.getImageUrl(album.images),
        this.getImageUrlXL(album.images)
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
                `${clientId}:${clientSecret}`
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

    return firstValueFrom(request()).catch(() => {
      return undefined;
    });
  }

  private getImageUrl(images: { url: string }[]): string {
    if (images.length > 1) {
      return images[images.length - 1].url;
    } else if (images.length === 1) {
      return images[0].url;
    }

    return '';
  }

  private getImageUrlXL(images: { url: string }[]): string {
    if (images.length > 1) {
      return images[0].url;
    } else if (images.length === 1) {
      return images[0].url;
    }

    return '';
  }
}

type Request<T> = () => Observable<T>;

interface ArtistResponse {
  name: string;
  id: string;
  popularity: number;
  images: {
    url: string;
  }[];
}

interface ArtistsResponse {
  artists: {
    items: ArtistResponse[];
  };
}

interface AlbumResponse {
  name: string;
  id: string;
  images: {
    url: string;
  }[];
}

interface ArtistAlbumsResponse {
  items: AlbumResponse[];
}
