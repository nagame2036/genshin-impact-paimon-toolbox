export class I18n {

  constructor(private moduleName: string) {
  }

  module(key: string): string {
    return `modules.${this.moduleName}.${key}`;
  }

  dict(key: string): string {
    return `dict.${key}`;
  }
}
