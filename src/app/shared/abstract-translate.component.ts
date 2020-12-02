export abstract class AbstractTranslateComponent {

  protected abstract i18nKey: string;

  i18nDict(key: string): string {
    return `dict.${key}`;
  }

  i18n(key: string): string {
    return `modules.${this.i18nKey}.${key}`;
  }
}
