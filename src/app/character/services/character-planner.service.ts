import {Injectable} from '@angular/core';
import {combineLatest, EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterPlan} from '../models/character-plan.model';
import {map, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {MaterialList} from '../../material/models/material-list.model';
import {CharacterRequirementService} from './character-requirement.service';
import {TalentRequirementService} from './talent-requirement.service';
import {Character} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {TalentProgress} from '../models/talent-progress.model';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialRequireList} from '../../material/models/material-require-list.model';
import {MaterialService} from '../../material/services/material.service';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class CharacterPlanner {

  private readonly i18n = new I18n('game-common');

  private readonly store = 'character-plans';

  private plans$ = new ReplaySubject<Map<number, CharacterPlan>>(1);

  readonly plans = this.plans$.asObservable();

  constructor(private characterReq: CharacterRequirementService, private talentReq: TalentRequirementService,
              private materials: MaterialService, private database: NgxIndexedDBService, private logger: NGXLogger) {
    this.database.getAll(this.store).subscribe(persisted => {
      this.logger.info('fetched character plans', persisted);
      const plans = new Map<number, CharacterPlan>();
      persisted.forEach(p => plans.set(p.id, p));
      this.plans$.next(plans);
    });
  }

  create(info: CharacterInfo, id: number): CharacterPlan {
    const talents: TalentProgress = {};
    info.talentsUpgradable.forEach(t => talents[t] = 1);
    return {id, ascension: 0, level: 1, talents};
  }

  get(id: number): Observable<CharacterPlan> {
    return this.plans.pipe(
      switchMap(plans => {
        const plan = plans.get(id);
        return plan ? of(plan) : EMPTY;
      }),
      throwIfEmpty()
    );
  }

  update({plan}: Character): void {
    const update = this.database.update(this.store, plan);
    zip(update, this.plans).subscribe(([, plans]) => {
      this.logger.info('updated character plan', plan);
      plans.set(plan.id, plan);
      this.plans$.next(plans);
    });
  }

  remove({plan}: Character): void {
    const id = plan.id;
    const remove = this.database.delete(this.store, id);
    zip(remove, this.plans).subscribe(([, plans]) => {
      this.logger.info('removed character plan', plan);
      plans.delete(id);
      this.plans$.next(plans);
    });
  }

  removeAll(characters: Character[]): void {
    const remove = characters.map(it => this.database.delete(this.store, it.plan.id));
    zip(forkJoin(remove), this.plans).subscribe(([, plans]) => {
      this.logger.info('removed character plans', characters);
      characters.forEach(it => plans.delete(it.plan.id));
      this.plans$.next(plans);
    });
  }

  totalRequirements(characters: Character[]): Observable<MaterialRequireList> {
    const subRequirements = [
      this.characterReq.totalRequirements(characters),
      this.talentReq.totalRequirements(characters),
    ];
    return combineLatest(subRequirements).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent total material requirements of all character plans', requirements))
    );
  }

  specificRequirements(character: Character): Observable<{ text: string, value: MaterialList, satisfied: boolean }>[] {
    const levelupTexts = [this.characterReq.levelupLabel, this.characterReq.ascensionLabel];
    const talentsTexts = character.info.talentsUpgradable.map(it => this.talentReq.getLabel(it));
    const texts = [
      [
        this.i18n.module('total-requirement'),
        ...levelupTexts,
        ...talentsTexts
      ],
      levelupTexts,
      ...talentsTexts.map(it => [it])
    ];
    this.logger.info('sent specific material requirements of character', character, texts);
    return texts.map(it => this.materials.getRequirements(ItemType.CHARACTER, character.plan.id, it));
  }
}
