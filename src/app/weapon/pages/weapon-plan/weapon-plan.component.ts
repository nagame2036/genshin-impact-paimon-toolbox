import {Component, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponWithStats} from '../../models/weapon.model';
import {WeaponService} from '../../services/weapon.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {MaterialType} from '../../../material/models/material-type.enum';
import {RequirementDetail} from '../../../material/models/requirement-detail.model';
import {MaterialService} from '../../../material/services/material.service';
import {ExecutePlanConfirmDialogComponent} from '../../../material/components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {NGXLogger} from 'ngx-logger';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-weapon-plan',
  templateUrl: './weapon-plan.component.html',
  styleUrls: ['./weapon-plan.component.scss']
})
export class WeaponPlanComponent extends AbstractObservableComponent implements OnInit {

  readonly i18n = new I18n('game-common');

  readonly types = [
    [MaterialType.CURRENCY, MaterialType.WEAPON_EXP],
    [MaterialType.WEAPON_14],
    [MaterialType.WEAPON_25],
    [MaterialType.WEAPON_36],
    [MaterialType.ENEMY_ELITE, MaterialType.ENEMY_MOB],
  ];

  readonly subtitles = [
    'common',
    '1/4/7',
    '2/5/7',
    '3/6/7',
    'enemy',
  ];

  weapon!: WeaponWithStats;

  requirements!: RequirementDetail[];

  reachedStates!: boolean[];

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(private service: WeaponService, private materials: MaterialService,
              private route: ActivatedRoute, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.route.parent?.params
      .pipe(
        switchMap(params => this.service.get(Number(params.id))),
        switchMap(weapon => this.service.getStats(weapon)),
        switchMap(weapon => {
          this.logger.info('received weapon', weapon);
          this.weapon = weapon;
          return this.service.getRequirementDetails(weapon);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(requirements => {
        this.requirements = requirements;
        this.reachedStates = requirements.map(it => it.reached);
      });
  }

  save(): void {
    this.service.update(this.weapon);
    this.logger.info('weapon saved', this.weapon);
  }

  executePlan(planIndex: number): void {
    this.logger.info('clicked to execute plan', planIndex);
    const {text: title, value: requirement} = this.requirements[planIndex];
    const data = {title, requirement, item: this.i18n.dict(`weapons.${this.weapon.info.id}`)};
    this.executePlanConfirm.open(data).afterConfirm().subscribe(_ => {
      this.materials.consumeRequire(requirement);
      this.executeLevelup();
      this.logger.info('executed levelup plan');
      this.save();
    });
  }

  private executeLevelup(): void {
    const {progress, plan} = this.weapon;
    progress.ascension = plan.ascension;
    progress.level = plan.level;
  }
}
