import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterService} from './character.service';
import {CharacterPlan} from '../models/character-plan.model';
import {TalentService} from './talent.service';
import {first, map, reduce, switchMap, take, tap} from 'rxjs/operators';
import {ItemList} from '../../inventory/models/item-list.model';
import {CharacterLevelupCostService} from './character-levelup-cost.service';
import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {PartyCharacter} from '../models/party-character.model';
import {activePlans} from '../../game-common/utils/party-plans';
import {MaterialRequireMarker} from '../../inventory/services/material-require-marker.service';
import {I18n} from '../../widget/models/i18n.model';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';

type ActivePlan = { plan: CharacterPlan, party: PartyCharacter };

@Injectable({
  providedIn: 'root'
})
export class CharacterPlanner {

  i18n = new I18n('game-common');

  private storeName = 'character-plans';

  #plans = new ReplaySubject<CharacterPlan[]>(1);

  readonly plans = this.#plans.asObservable();

  activePlans = new ReplaySubject<ActivePlan[]>(1);

  private readonly type = ItemType.CHARACTER;

  constructor(private database: NgxIndexedDBService, private characters: CharacterService, private talents: TalentService,
              private characterLevelup: CharacterLevelupCostService, private talentLevelup: TalentLevelupCostService,
              private marker: MaterialRequireMarker, private logger: NGXLogger) {
    this.database.getAll(this.storeName).subscribe(plans => {
      this.logger.info('loaded character plans', plans);
      this.#plans.next(plans);
    });
    combineLatest([this.plans, this.characters.partyMap]).subscribe(([plans, party]) => {
      const active = activePlans(plans, party);
      this.marker.clear(this.type);
      this.logger.info('updated active plans', active);
      this.activePlans.next(active);
    });
  }

  getPlan(id: number): Observable<CharacterPlan> {
    return this.getActivePlan(id).pipe(
      first(),
      map(active => active.plan),
      tap(plan => this.logger.info('sent character plan', plan)),
    );
  }

  updatePlan(plan: CharacterPlan): void {
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      this.logger.info('updated character plan', plan);
      const newPlans = plans.filter(it => it.id !== plan.id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }

  allPlansCost(): Observable<ItemList> {
    return this.activePlans.pipe(
      switchMap(plans => {
        const costs = [this.characterLevelup.totalCost(plans), this.talentLevelup.totalCost(plans)];
        return iif(
          () => plans.length === 0,
          of(new ItemList()),
          combineLatest(costs).pipe(
            switchMap(it => it),
            take(costs.length),
            reduce((total, curr) => total.combine(curr), new ItemList()),
          )
        );
      }),
      tap(cost => this.logger.info('sent total cost of character plans', cost)),
    );
  }

  specificPlanCost(id: number): Observable<{ text: string, value: Observable<ItemList> }[]> {
    return this.getActivePlan(id).pipe(map(({party, plan}) => {
      this.logger.info('sent the cost of character plan', id);
      const levelup = this.characterLevelup.cost(party, new AscensionLevel(plan.ascension, plan.level));
      const talents = plan.talents.map(goalTalent => this.talentLevelup.cost(party, [goalTalent]));
      const total = combineLatest([levelup, ...talents]).pipe(map(list => {
        return list.reduce((acc, curr) => acc.combine(curr), new ItemList());
      }));
      return [
        {text: this.i18n.module('total-requirement'), value: total},
        {text: this.i18n.module('levelup-requirement'), value: levelup},
        ...talents.map((it, index) => ({text: this.i18n.module(`talent-requirement.${index}`), value: it})),
      ];
    }));
  }

  private getActivePlan(id: number): Observable<ActivePlan> {
    return this.activePlans.pipe(switchMap(plans => {
      const index = plans.findIndex(it => it.plan.id === id);
      return iif(() => index !== -1, defer(() => of(plans[index])));
    }));
  }
}
