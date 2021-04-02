import {Injectable} from '@angular/core';
import {SettingService} from '../../setting/services/setting.service';
import {languageSettingKey} from '../../app-translate.module';
import {ReplaySubject} from 'rxjs';

const timeFormat = {
  hour12: false,
  month: 'short',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
};

@Injectable({
  providedIn: 'root',
})
export class ResinService {
  maxResin = 160;

  replenishUseMinutes = 8;

  currentLanguage = '';

  languageChanged = new ReplaySubject(1);

  constructor(settings: SettingService) {
    settings.get<string>(languageSettingKey).subscribe(lang => {
      this.currentLanguage = lang;
      this.languageChanged.next();
    });
  }

  getReplenishDate(
    target: number,
    current: number,
    replenishInMinutes: number,
  ): string {
    const useMinutes = this.replenishUseMinutes;
    const remaining = target - current - 1;
    const remainingMinutes = remaining * useMinutes + replenishInMinutes;
    const minutes = Math.max(0, remainingMinutes);
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return time
      .toLocaleString(this.currentLanguage, timeFormat)
      .replace('24:', '00:');
  }
}
