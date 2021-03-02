import {Component, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterOverview} from '../../models/character.model';
import {CharacterService} from '../../services/character.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {RequirementDetail} from '../../../material/models/requirement-detail.model';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialService} from '../../../material/services/material.service';
import {ExecutePlanConfirmDialogComponent} from '../../../material/components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {NGXLogger} from 'ngx-logger';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

@Component({
  selector: 'app-character-plan',
  templateUrl: './character-plan.component.html',
  styleUrls: ['./character-plan.component.scss'],
})
export class CharacterPlanComponent
  extends AbstractObservableComponent
  implements OnInit {
  readonly i18n = new I18n('game-common');

  readonly types: [string, ...MaterialType[]][] = [
    [
      'common',
      MaterialType.CURRENCY,
      MaterialType.LOCAL_SPECIALTY,
      MaterialType.CHARACTER_EXP,
    ],
    [
      'boss',
      MaterialType.TALENT_COMMON,
      MaterialType.CHARACTER_BOSS,
      MaterialType.CHARACTER_GEM,
    ],
    ['1/4/7', MaterialType.TALENT_14],
    ['2/5/7', MaterialType.TALENT_25],
    ['3/6/7', MaterialType.TALENT_36],
    ['enemy', MaterialType.ENEMY_MOB],
  ];

  character!: CharacterOverview;

  requirements!: RequirementDetail[];

  reachedStates!: boolean[];

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(
    private service: CharacterService,
    private materials: MaterialService,
    private route: ActivatedRoute,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.route.parent?.params
      .pipe(
        switchMap(params => this.service.get(Number(params.id))),
        switchMap(character => this.service.getOverview(character)),
        switchMap(character => {
          this.logger.info('received character', character);
          this.character = character;
          return this.service.getRequirementDetails(character);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(requirements => {
        this.requirements = requirements;
        this.reachedStates = requirements.map(it => it.reached);
      });
  }

  save(): void {
    this.service.update(this.character);
    this.logger.info('character saved', this.character);
  }

  executePlan(planIndex: number): void {
    this.logger.info('clicked to execute plan', planIndex);
    const {text: title, value: requirement} = this.requirements[planIndex];
    const item = this.i18n.dict(`characters.${this.character.info.id}`);
    const data = {title, requirement, item};
    this.executePlanConfirm
      .open(data)
      .afterConfirm()
      .subscribe(_ => {
        this.materials.consumeRequire(requirement);
        this.executePlanByIndex(planIndex);
        this.save();
      });
  }

  private executePlanByIndex(planIndex: number): void {
    switch (planIndex) {
      case 0:
        this.executeAll();
        this.logger.info('executed all plan');
        break;
      case 1:
        this.executeLevelup();
        this.logger.info('executed levelup plan');
        break;
      default:
        this.executeTalentLevelup(planIndex - 2);
        break;
    }
  }

  private executeAll(): void {
    this.executeLevelup();
    const talentsLength = this.character.info.talentsUpgradable.length;
    for (let i = 0; i < talentsLength; i++) {
      this.executeTalentLevelup(i);
    }
  }

  private executeLevelup(): void {
    const {progress, plan} = this.character;
    progress.ascension = plan.ascension;
    progress.level = plan.level;
  }

  private executeTalentLevelup(index: number): void {
    const id = this.character.info.talentsUpgradable[index];
    this.character.progress.talents[id] = this.character.plan.talents[id];
  }
}
