export class Album {
  constructor(
    public id: string,
    public name: string,
    public releaseDate: Date,
    public image: string,
    public imageXL: string,
    public artistId: string,
  ) {}
}
