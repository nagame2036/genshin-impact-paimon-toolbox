import {Component, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Character} from '../../models/character.model';
import {CharacterService} from '../../services/character.service';
import {ActivatedRoute} from '@angular/router';
import {first, switchMap, tap} from 'rxjs/operators';
import {MaterialList} from '../../../material/models/material-list.model';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialService} from '../../../material/services/material.service';
import {ExecutePlanConfirmDialogComponent} from '../../../material/components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-character-plan',
  templateUrl: './character-plan.component.html',
  styleUrls: ['./character-plan.component.scss']
})
export class CharacterPlanComponent implements OnInit {

  readonly i18n = new I18n('game-common');

  readonly types = [
    [MaterialType.CURRENCY, MaterialType.LOCAL_SPECIALTY, MaterialType.CHARACTER_EXP],
    [MaterialType.TALENT_COMMON, MaterialType.CHARACTER_BOSS, MaterialType.CHARACTER_GEM],
    [MaterialType.TALENT_14],
    [MaterialType.TALENT_25],
    [MaterialType.TALENT_36],
    [MaterialType.ENEMY_MOB],
  ];

  readonly subtitles = [
    'common',
    'boss',
    '1/4/7',
    '2/5/7',
    '3/6/7',
    'enemy',
  ];

  character!: Character;

  requirements: Observable<{ text: string; value: MaterialList; satisfied: boolean }>[] = [];

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(private service: CharacterService, private materials: MaterialService,
              private route: ActivatedRoute, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.route.parent?.params
      .pipe(
        switchMap(params => this.service.get(Number(params.id))),
        first(),
      )
      .subscribe(character => {
        this.logger.info('received character', character);
        this.character = character;
        this.requirements = this.service.specificRequirement(character);
      });
  }

  save(): void {
    this.service.update(this.character);
    this.logger.info('character saved', this.character);
  }

  executePlan(planIndex: number): void {
    this.logger.info('clicked to execute plan', planIndex);
    this.requirements[planIndex].pipe(
      first(),
      switchMap(plan => {
        const {text: title, value: cost} = plan;
        const data = {title, cost, item: this.i18n.dict(`characters.${this.character.info.id}`)};
        return this.executePlanConfirm.open(data).afterConfirm().pipe(tap(_ => {
          this.materials.consumeRequire(cost);
          this.executePlanByIndex(planIndex);
          this.save();
        }));
      })
    ).subscribe();
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
        const talentIndex = planIndex - 2;
        this.executeTalentLevelup(talentIndex);
        this.logger.info(`executed talent ${talentIndex} plan`);
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
    const talentId = this.character.info.talentsUpgradable[index];
    this.character.progress.talents[talentId] = this.character.plan.talents[talentId];
  }
}
