export class Artist {
  selected = false;

  constructor(
    public name: string,
    public mbid: string,
    public listeners: number,
    public image: string,
    public imageXL: string
  ) {}
}
