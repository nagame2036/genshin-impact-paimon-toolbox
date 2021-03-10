import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponInfo} from '../../models/weapon-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {WeaponService} from '../../services/weapon.service';
import {WeaponViewService} from '../../services/weapon-view.service';

@Component({
  selector: 'app-weapon-info-list',
  templateUrl: './weapon-info-list.component.html',
  styleUrls: ['./weapon-info-list.component.scss'],
})
export class WeaponInfoListComponent implements OnChanges {
  readonly i18n = new I18n('weapons');

  @Input()
  weapons: WeaponInfo[] = [];

  items!: WeaponInfo[];

  @Output()
  selected = new EventEmitter<WeaponInfo>();

  constructor(
    private service: WeaponService,
    public view: WeaponViewService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('weapons')) {
      this.logger.info('received weapons', this.weapons);
      this.update();
    }
  }

  update(): void {
    this.view.viewInfos(this.weapons).subscribe(items => {
      this.items = items;
    });
  }

  select(item: WeaponInfo): void {
    this.logger.info('selected character', item);
    this.selected.emit(item);
  }
}
