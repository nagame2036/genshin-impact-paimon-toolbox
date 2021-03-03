import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterPlan} from '../models/character-plan.model';
import {map} from 'rxjs/operators';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {CharacterRequirementService} from './character-requirement.service';
import {TalentRequirementService} from './talent-requirement.service';
import {Character} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {TalentProgress} from '../models/talent-progress.model';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {MaterialService} from '../../material/services/material.service';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {TalentInfoService} from './talent-info.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterPlanner {
  private readonly type = ItemType.CHARACTER;

  private readonly i18n = new I18n('game-common');

  private readonly store = 'character-plans';

  private plans$ = new ReplaySubject<Map<number, CharacterPlan>>(1);

  readonly plans = this.plans$.asObservable();

  constructor(
    private characterReq: CharacterRequirementService,
    private talentReq: TalentRequirementService,
    private talentInfos: TalentInfoService,
    private materials: MaterialService,
    private database: NgxIndexedDBService,
    private logger: NGXLogger,
  ) {
    this.database.getAll(this.store).subscribe(persisted => {
      this.logger.info('fetched character plans', persisted);
      const plans = new Map<number, CharacterPlan>();
      persisted.forEach(p => plans.set(p.id, p));
      this.plans$.next(plans);
    });
  }

  create(info: CharacterInfo, id: number): CharacterPlan {
    const talents: TalentProgress = {};
    info.talentsUpgradable.forEach(t => (talents[t] = 1));
    return {id, ascension: 0, level: 1, talents};
  }

  updateRequire(character: Character): void {
    const talents = this.talentInfos.getAll(character.info.talentsUpgradable);
    const subRequirement = [
      this.characterReq.requirement(character),
      this.talentReq.requirement(character, talents),
    ];
    const req = new MaterialRequireList(subRequirement);
    this.materials.updateRequire(this.type, character.plan.id, req);
  }

  getRequireDetails(character: Character): Observable<RequireDetail[]> {
    return this.materials.getRequirement(this.type, character.plan.id).pipe(
      map(req => {
        const talents = character.info.talentsUpgradable;
        const texts = [
          this.i18n.module('total-requirement'),
          this.characterReq.levelupLabel,
          ...talents.map(it => this.talentReq.getLabel(it)),
        ];
        this.logger.info('sent require detail', character, req);
        return req.sort(
          (a, b) => texts.indexOf(a.text) - texts.indexOf(b.text),
        );
      }),
    );
  }

  update(character: Character): Observable<void> {
    const plan = character.plan;
    const update = this.database.update(this.store, plan);
    return zip(update, this.plans).pipe(
      map(([, plans]) => {
        this.logger.info('updated character plan', plan);
        plans.set(plan.id, plan);
        this.plans$.next(plans);
        this.updateRequire(character);
      }),
    );
  }

  remove({plan}: Character): Observable<void> {
    const id = plan.id;
    const remove = this.database.delete(this.store, id);
    return zip(remove, this.plans).pipe(
      map(([, plans]) => {
        this.logger.info('removed character plan', plan);
        plans.delete(id);
        this.plans$.next(plans);
        this.materials.removeRequire(this.type, id);
      }),
    );
  }

  removeAll(characters: Character[]): Observable<void> {
    const planIds = characters.map(it => it.plan.id);
    const remove = planIds.map(it => this.database.delete(this.store, it));
    return zip(forkJoin(remove), this.plans).pipe(
      map(([, plans]) => {
        this.logger.info('removed character plans', characters);
        planIds.forEach(it => plans.delete(it));
        this.plans$.next(plans);
        this.materials.removeAllRequire(this.type, planIds);
      }),
    );
  }
}
