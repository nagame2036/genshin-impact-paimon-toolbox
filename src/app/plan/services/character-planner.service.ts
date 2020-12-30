import {Injectable} from '@angular/core';
import {combineLatest, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterService} from '../../character-and-gear/services/character.service';
import {CharacterPlan} from '../models/character-plan.model';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {TalentService} from '../../character-and-gear/services/talent.service';
import {getLevelupPlan} from '../models/levelup-plan.model';
import {TalentLevelData} from '../../character-and-gear/models/talent-level-data.model';
import {map, switchMap} from 'rxjs/operators';
import {ItemCostList} from '../models/item-cost-list.model';
import {CharacterLevelupCostService} from './character-levelup-cost.service';
import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';
import {activePlans} from '../utils/party-plans';

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
      map(([plans, partyList]) => activePlans(plans, partyList)
      ));
  }

  getPlan(id: number): Observable<CharacterPlan> {
    return this.activePlans.pipe(switchMap(plans => {
      const index = plans.findIndex(it => it.plan.id === id);
      const plan = plans[index];
      return iif(() => plan !== undefined, of(plan.plan));
    }));
  }

  updatePlan(id: number, ascension: Ascension, level: number, talentsData: TalentLevelData[]): void {
    const levelup = getLevelupPlan(ascension, level);
    const talents = this.talents.correctLevels(ascension, talentsData);
    const plan: CharacterPlan = {id, levelup, talents};
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      const newPlans = plans.filter(it => it.id !== id);
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
}
