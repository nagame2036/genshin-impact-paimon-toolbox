import {Component, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyCharacter} from '../../models/party-character.model';
import {CharacterPlan} from '../../models/character-plan.model';
import {CharacterService} from '../../services/character.service';
import {CharacterPlanner} from '../../services/character-planner.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {first, switchMap, takeUntil} from 'rxjs/operators';
import {ItemList} from '../../../inventory/models/item-list.model';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../inventory/models/material-type.enum';
import {CharacterRequirementService} from '../../services/character-requirement.service';
import {ExecutePlanConfirmDialogComponent} from '../../../game-common/components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-character-plan',
  templateUrl: './character-plan.component.html',
  styleUrls: ['./character-plan.component.scss']
})
export class CharacterPlanComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('game-common');

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

  party!: PartyCharacter;

  plan!: CharacterPlan;

  requirements!: { text: string, value: Observable<ItemList>, satisfied: Observable<boolean> }[];

  @ViewChild('executePlanConfirm')
  executePlanConfirm!: ExecutePlanConfirmDialogComponent;

  constructor(private characters: CharacterService, private planner: CharacterPlanner, private requirement: CharacterRequirementService,
              private route: ActivatedRoute, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.route.parent?.params
      .pipe(
        first(),
        switchMap(params => {
          const id = Number(params.id);
          return this.characters.getPartyCharacter(id).pipe(switchMap(character => {
            this.logger.info('received character', character);
            this.party = character;
            return this.planner.getPlan(id).pipe(switchMap(plan => {
              this.logger.info('received character plan', plan);
              this.plan = plan;
              return this.requirement.getRequirements(id);
            }));
          }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(requirements => {
        this.logger.info('received character requirements', requirements);
        return this.requirements = requirements;
      });
  }

  saveParty(): void {
    this.characters.updatePartyMember(this.party);
    this.logger.info('character saved', this.party);
  }

  savePlan(): void {
    this.planner.updatePlan(this.plan);
    this.logger.info('plan saved', this.plan);
  }

  executePlanAndSave(planIndex: number): void {
    const plan = this.requirements[planIndex];
    const data = {title: plan.text, cost: plan.value, item: this.i18n.dict(`characters.${this.party.id}`)};
    this.executePlanConfirm.open(data).afterConfirm().subscribe(_ => {
      this.requirement.consumeMaterial(plan.value);
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
      this.saveParty();
    });
  }

  private executeAll(): void {
    this.executeLevelup();
    const talentsLength = this.party.talents.length;
    for (let i = 0; i < talentsLength; i++) {
      this.executeTalentLevelup(i);
    }
  }

  private executeLevelup(): void {
    this.party.ascension = this.plan.ascension;
    this.party.level = this.plan.level;
  }

  private executeTalentLevelup(index: number): void {
    this.party.talents[index].level = this.plan.talents[index].level;
  }
}
