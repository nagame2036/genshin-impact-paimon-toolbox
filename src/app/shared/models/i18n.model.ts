export class I18n {

  constructor(private moduleName: string) {
  }

  module(key: string): string {
    return `modules.${this.moduleName}.${key}`;
  }

  pModule(key: string): string {
    return `t@modules.${this.moduleName}.${key}`;
  }

  dict(key: string): string {
    return `dict.${key}`;
  }

  pDict(key: string): string {
    return `t@dict.${key}`;
  }
}
