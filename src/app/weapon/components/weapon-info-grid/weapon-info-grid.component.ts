import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-weapon-info-grid',
  templateUrl: './weapon-info-grid.component.html',
  styleUrls: ['./weapon-info-grid.component.scss'],
})
export class WeaponInfoGridComponent
  extends AbstractObservableDirective
  implements OnInit, OnChanges {
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

  private updated$ = new Subject();

  constructor(
    public service: WeaponService,
    public view: WeaponViewService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.updated$
      .pipe(
        switchMap(_ => this.view.viewInfos(this.weapons)),
        takeUntil(this.destroy$),
      )
      .subscribe(items => {
        this.items = items;
      });
    this.updated$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.weapons) {
      this.logger.info('received weapons', this.weapons);
      this.update();
    }
  }

  update(): void {
    this.updated$.next();
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
