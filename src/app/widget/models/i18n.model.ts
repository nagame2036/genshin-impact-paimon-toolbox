export class I18n {
  static paramPrefix = '@';

  private static pool = new Map<string, I18n>();

  private constructor(private moduleName: string) {}

  static create(moduleName: string): I18n {
    const existing = I18n.pool.get(moduleName);
    if (existing) {
      return existing;
    }
    const i18n = new I18n(moduleName);
    I18n.pool.set(moduleName, i18n);
    return i18n;
  }

  path(key: string): string {
    return `path.${key}`;
  }

  module(key: string): string {
    return `modules.${this.moduleName}.${key}`;
  }

  param(key: string): string {
    return `${I18n.paramPrefix}${key}`;
  }

  pModule(key: string): string {
    return this.param(this.module(key));
  }

  dict(key: string): string {
    return `dict.${key}`;
  }

  pDict(key: string): string {
    return this.param(this.dict(key));
  }

  data(...keys: any[]): string {
    return `data.${keys.join('.')}`;
  }

  stats(key: string): string {
    return key === 'none' ? this.dict('none') : this.data(`stats.${key}`);
  }

  pStats(type: string | 'none'): string {
    return this.param(this.stats(type));
  }

  error(key: string): string {
    return this.dict(`errors.${key}`);
  }
}
