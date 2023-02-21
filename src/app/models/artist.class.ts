export class Artist {
  name: string;
  mbid: string;
  listeners: number;
  image: string;
  selected = false;

  constructor(name: string, mbid: string, listeners: number, image: string) {
    this.name = name;
    this.mbid = mbid;
    this.listeners = listeners;
    this.image = image;
  }
}
