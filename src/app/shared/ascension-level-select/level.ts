export class Level {

  constructor(public ascension: number = 6, public level: number = 90) {
  }

  copyFrom(that: Level): void {
    this.ascension = that.ascension;
    this.level = that.level;
  }
}
