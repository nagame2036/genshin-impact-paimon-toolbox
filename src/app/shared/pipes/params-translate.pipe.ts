import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'paramsTranslate'
})
export class ParamsTranslatePipe implements PipeTransform {

  constructor(private translator: TranslateService) {
  }

  transform(query: string, params: { [key: string]: any }): object {
    const newParams = Object.assign({}, params);
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('t@')) {
        const actualValue = value.replace('t@', '');
        newParams[key] = this.translator.instant(actualValue);
      }
    });
    return this.translator.instant(query, newParams);
  }

}
