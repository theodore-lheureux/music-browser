import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.class';
import { Observable, firstValueFrom } from 'rxjs';
import { clientId, clientSecret } from '../app.config';
import { Album } from '../models/album.class';
import { Song } from '../models/song.class';

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
        `${this.apiURL}/artists/${id}/albums?limit=${limit}&offset=${offset}&include_groups=album&market=CA`,
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
        new Date(album.release_date),
        this.getImageUrl(album.images),
        this.getImageUrlXL(album.images),
        album.artists[0].id
      );
    });
  }

  public async getAlbum(id: string): Promise<Album | undefined> {
    const response = await this.executeRequest<AlbumResponse>(() =>
      this.http.get<AlbumResponse>(`${this.apiURL}/albums/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
    );

    if (!response) return undefined;

    return new Album(
      response.id,
      response.name,
      new Date(response.release_date),
      this.getImageUrl(response.images),
      this.getImageUrlXL(response.images),
      response.artists[0].id
    );
  }

  async getAlbumSongs(album: Album): Promise<Song[]> {
    const response = await this.executeRequest<AlbumSongsResponse>(() =>
      this.http.get<AlbumSongsResponse>(
        `${this.apiURL}/albums/${album.id}/tracks`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      )
    );

    if (!response) return [];

    return response.items.map((song) => {
      return new Song(song.id, song.name, song.duration_ms, album);
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

    return './assets/images/artist-placeholder.png';
  }

  private getImageUrlXL(images: { url: string }[]): string {
    if (images.length > 1) {
      return images[0].url;
    } else if (images.length === 1) {
      return images[0].url;
    }

    return './assets/images/artist-placeholder.png';
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
  release_date: string;
  images: {
    url: string;
  }[];
  artists: {
    id: string;
  }[];
}

interface ArtistAlbumsResponse {
  items: AlbumResponse[];
}

interface SongResponse {
  name: string;
  id: string;
  duration_ms: number;
}

interface AlbumSongsResponse {
  items: SongResponse[];
}
