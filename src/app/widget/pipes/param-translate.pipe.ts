import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {I18n} from '../models/i18n.model';

@Pipe({
  name: 'paramTranslate',
})
export class ParamTranslatePipe implements PipeTransform {
  constructor(private translator: TranslateService) {}

  transform(query: string, params: {[key: string]: any}): object {
    const prefix = I18n.paramPrefix;
    const newParams = Object.assign({}, params);
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith(prefix)) {
        const actualValue = value.replace(prefix, '');
        newParams[key] = this.translator.instant(actualValue);
      }
    });
    return this.translator.instant(query, newParams);
  }
}
