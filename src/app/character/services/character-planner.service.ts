import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterPlan} from '../models/character-plan.model';
import {map, switchMap, tap} from 'rxjs/operators';
import {RequirementDetail} from '../../material/models/requirement-detail.model';
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

  getRequirement(character: Character): Observable<MaterialRequireList> {
    const talentsUpgradable = character.info.talentsUpgradable;
    const subRequirement = [
      this.characterReq.requirement(character),
      this.talentInfos
        .getAll(talentsUpgradable)
        .pipe(
          switchMap(talents => this.talentReq.requirement(character, talents)),
        ),
    ];
    return forkJoin(subRequirement).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(req => this.logger.info('sent requirements', character, req)),
    );
  }

  getRequirementDetails(character: Character): Observable<RequirementDetail[]> {
    return this.materials
      .getRequirement(ItemType.CHARACTER, character.plan.id)
      .pipe(
        map(req => {
          const talents = character.info.talentsUpgradable;
          const texts = [
            this.i18n.module('total-requirement'),
            this.characterReq.levelupLabel,
            ...talents.map(it => this.talentReq.getLabel(it)),
          ];
          this.logger.info('sent requirement detail', character, req);
          return req.sort(
            (a, b) => texts.indexOf(a.text) - texts.indexOf(b.text),
          );
        }),
      );
  }

  update({plan}: Character): Observable<void> {
    const update = this.database.update(this.store, plan);
    return zip(update, this.plans).pipe(
      map(([, plans]) => {
        this.logger.info('updated character plan', plan);
        plans.set(plan.id, plan);
        this.plans$.next(plans);
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
      }),
    );
  }

  removeAll(characters: Character[]): Observable<void> {
    const remove = characters.map(it =>
      this.database.delete(this.store, it.plan.id),
    );
    return zip(forkJoin(remove), this.plans).pipe(
      map(([, plans]) => {
        this.logger.info('removed character plans', characters);
        characters.forEach(it => plans.delete(it.plan.id));
        this.plans$.next(plans);
      }),
    );
  }
}
