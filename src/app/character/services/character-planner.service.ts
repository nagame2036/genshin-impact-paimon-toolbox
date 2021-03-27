import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterPlan} from '../models/character-plan.model';
import {map, tap} from 'rxjs/operators';
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

  private readonly i18n = I18n.create('game-common');

  private readonly store = 'character-plans';

  readonly plans = new Map<number, CharacterPlan>();

  readonly ready = new ReplaySubject(1);

  constructor(
    private characterReq: CharacterRequirementService,
    private talentReq: TalentRequirementService,
    private talentInfos: TalentInfoService,
    private materials: MaterialService,
    private database: NgxIndexedDBService,
    private logger: NGXLogger,
  ) {
    this.database.getAll(this.store).subscribe(plans => {
      this.logger.info('fetched character plans', plans);
      for (const p of plans) {
        this.plans.set(p.id, p);
      }
      this.ready.next();
      this.ready.complete();
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
    const texts = [
      this.i18n.module('total-requirement'),
      this.characterReq.levelupLabel,
    ];
    character.info.talentsUpgradable.forEach(it => {
      texts.push(this.talentReq.getLabel(it));
    });
    return this.materials
      .getRequireDetails(this.type, character.plan.id, texts)
      .pipe(
        tap(req => this.logger.info('sent require detail', character, req)),
      );
  }

  update(character: Character): Observable<void> {
    const plan = character.plan;
    return this.database.update(this.store, plan).pipe(
      map(_ => {
        this.logger.info('updated character plan', plan);
        this.plans.set(plan.id, plan);
        this.updateRequire(character);
      }),
    );
  }

  removeAll(characters: Character[]): Observable<void> {
    const planIds = characters.map(it => it.plan.id);
    const remove = planIds.map(it => this.database.delete(this.store, it));
    return forkJoin(remove).pipe(
      map(_ => {
        this.logger.info('removed character plans', characters);
        planIds.forEach(it => this.plans.delete(it));
        this.materials.removeAllRequire(this.type, planIds);
      }),
    );
  }
}
