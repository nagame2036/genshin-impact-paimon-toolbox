export class I18n {
  constructor(private moduleName: string) {}

  path(key: string): string {
    return `path.${key}`;
  }

  module(key: string): string {
    return `modules.${this.moduleName}.${key}`;
  }

  dict(key: string): string {
    return `dict.${key}`;
  }

  stats(key: string): string {
    return `dict.stats.${key}`;
  }
}
