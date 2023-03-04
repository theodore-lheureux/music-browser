import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { googleAPIKey } from '../app.config';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  apiURL =
    'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=';

  constructor(private http: HttpClient) {}

  async getSong(
    title: string,
    artistName: string
  ): Promise<YoutubeResponse | undefined> {
    let res;

    try {
      res = await lastValueFrom(
        this.http.get<YoutubeResponse>(
          `${this.apiURL}${title}%20${artistName}&key=${googleAPIKey}`
        )
      );
    } catch (error) {
      console.error(error);
      return undefined;
    }
    return res;
  }
}

export interface YoutubeResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: Item[];
}

export interface Item {
  kind: string;
  etag: string;
  id: ID;
  snippet: Snippet;
}

export interface ID {
  kind: string;
  videoId: string;
}

export interface Snippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: Date;
}

export interface Thumbnails {
  default: Default;
  medium: Default;
  high: Default;
}

export interface Default {
  url: string;
  width: number;
  height: number;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
