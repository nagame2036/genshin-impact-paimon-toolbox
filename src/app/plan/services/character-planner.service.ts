import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterService} from '../../character-and-gear/services/character.service';
import {CharacterPlan} from '../models/character-plan.model';
import {TalentService} from '../../character-and-gear/services/talent.service';
import {getLevelupPlan, toAscensionLevel} from '../models/levelup-plan.model';
import {map, switchMap} from 'rxjs/operators';
import {ItemCostList} from '../models/item-cost-list.model';
import {CharacterLevelupCostService} from './character-levelup-cost.service';
import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';
import {activePlans} from '../utils/party-plans';
import {CharacterPlanDetail} from '../models/character-plan-detail.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterPlanner {

  private storeName = 'character-plans';

  #plans = new ReplaySubject<CharacterPlan[]>(1);

  readonly plans = this.#plans.asObservable();

  activePlans: Observable<{ plan: CharacterPlan, party: PartyCharacter }[]>;

  constructor(private database: NgxIndexedDBService, private characters: CharacterService, private talents: TalentService,
              private characterLevelup: CharacterLevelupCostService, private talentLevelup: TalentLevelupCostService) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
    this.activePlans = combineLatest([this.plans, this.characters.partyMap]).pipe(
      map(([plans, partyList]) => activePlans(plans, partyList))
    );
  }

  getPlan(id: number): Observable<CharacterPlan> {
    return this.activePlans.pipe(switchMap(plans => {
      const index = plans.findIndex(it => it.plan.id === id);
      return iif(() => index !== -1, defer(() => of(plans[index].plan)));
    }));
  }

  updatePlan(detail: CharacterPlanDetail): void {
    const plan = this.getPlanDTO(detail);
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      const newPlans = plans.filter(it => it.id !== detail.id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }

  plansCost(): Observable<ItemCostList> {
    return this.activePlans.pipe(switchMap(it => iif(
      () => it.length === 0,
      of(new ItemCostList()),
      this.characterLevelup.totalCost(it).pipe(
        switchMap(levelupCost => this.talentLevelup.totalCost(it).pipe(
          map(talentsCost => levelupCost.combine(talentsCost))
        ))
      )
    )));
  }

  getPlanDTO(detail: CharacterPlanDetail): CharacterPlan {
    const {id, ascension, level, talents} = detail;
    const levelup = getLevelupPlan(ascension, level);
    return {id, levelup, talents};
  }

  getPlanDetail(plan: CharacterPlan): CharacterPlanDetail {
    const {id, levelup, talents} = plan;
    const {ascension, level} = toAscensionLevel(levelup);
    return {id, ascension, level, talents};
  }
}
