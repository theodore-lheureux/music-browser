import { Album } from './album.class';

export class Song {
  constructor(
    public id: string,
    public name: string,
    public duration: number,
    public album: Album
  ) {}
}
