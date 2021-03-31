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
import {MaterialDetail} from '../../../material/models/material.model';

@Component({
  selector: 'app-weapon-info-grid',
  templateUrl: './weapon-info-grid.component.html',
  styleUrls: ['./weapon-info-grid.component.scss'],
})
export class WeaponInfoGridComponent implements OnChanges {
  readonly i18n = I18n.create('weapons');

  @Input()
  weapons: WeaponInfo[] = [];

  items!: WeaponInfo[];

  @Input()
  clickText!: string;

  clicked: WeaponInfo | null = null;

  summaryMaterials!: MaterialDetail[];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<WeaponInfo>();

  constructor(
    public service: WeaponService,
    public view: WeaponViewService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.weapons) {
      this.logger.info('received weapons', this.weapons);
      this.update();
    }
  }

  update(): void {
    this.view.viewInfos(this.weapons).subscribe(items => {
      this.items = items;
    });
  }

  click(item: WeaponInfo): void {
    this.logger.info('clicked weapon', item);
    this.clicked = this.clicked === item ? null : item;
    if (this.clicked) {
      this.summaryMaterials = this.service.getRequireMaterials(item);
    }
  }

  doubleClick(item: WeaponInfo): void {
    this.logger.info('double clicked weapon', item);
    this.doubleClicked.emit(item);
  }
}
