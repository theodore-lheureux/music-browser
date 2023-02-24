export class Artist {
  selected = false;

  constructor(
    public id: string,
    public name: string,
    public listeners: number,
    public image: string,
    public imageXL: string
  ) {}
}
