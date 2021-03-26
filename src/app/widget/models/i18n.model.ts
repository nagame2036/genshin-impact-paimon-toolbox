export class I18n {
  static paramPrefix = '@';

  constructor(private moduleName: string) {}

  path(key: string): string {
    return `path.${key}`;
  }

  module(key: string): string {
    return `modules.${this.moduleName}.${key}`;
  }

  pModule(key: string): string {
    return `${I18n.paramPrefix}${this.module(key)}`;
  }

  dict(key: string): string {
    return `dict.${key}`;
  }

  pDict(key: string): string {
    return `${I18n.paramPrefix}${this.dict(key)}`;
  }

  stats(key: string): string {
    return `dict.stats.${key}`;
  }

  error(key: string): string {
    return `dict.errors.${key}`;
  }
}
