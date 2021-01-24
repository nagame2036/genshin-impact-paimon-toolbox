import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterService} from '../../character/services/character.service';
import {CharacterPlan} from '../models/character-plan.model';
import {TalentService} from '../../character/services/talent.service';
import {first, map, switchMap} from 'rxjs/operators';
import {ItemList} from '../../material/models/item-list.model';
import {CharacterLevelupCostService} from './character-levelup-cost.service';
import {TalentLevelupCostService} from './talent-levelup-cost.service';
import {PartyCharacter} from '../../character/models/party-character.model';
import {activePlans} from '../utils/party-plans';
import {MaterialCostMarker} from '../../material/services/material-cost-marker.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterPlanner {

  private storeName = 'character-plans';

  #plans = new ReplaySubject<CharacterPlan[]>(1);

  readonly plans = this.#plans.asObservable();

  activePlans = new ReplaySubject<{ plan: CharacterPlan, party: PartyCharacter }[]>(1);

  constructor(private database: NgxIndexedDBService, private characters: CharacterService, private talents: TalentService,
              private characterLevelup: CharacterLevelupCostService, private talentLevelup: TalentLevelupCostService,
              private marker: MaterialCostMarker) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
    combineLatest([this.plans, this.characters.partyMap]).subscribe(([plans, party]) => {
      this.activePlans.next(activePlans(plans, party));
    });
  }

  getPlan(id: number): Observable<CharacterPlan> {
    return this.activePlans.pipe(
      switchMap(plans => {
        const index = plans.findIndex(it => it.plan.id === id);
        return iif(() => index !== -1, defer(() => of(plans[index].plan)));
      }),
      first()
    );
  }

  updatePlan(plan: CharacterPlan): void {
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      this.marker.clear();
      const newPlans = plans.filter(it => it.id !== plan.id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }

  plansCost(): Observable<ItemList> {
    return this.activePlans.pipe(switchMap(it => iif(
      () => it.length === 0,
      of(new ItemList()),
      this.characterLevelup.totalCost(it).pipe(
        switchMap(levelupCost => this.talentLevelup.totalCost(it).pipe(
          map(talentsCost => levelupCost.combine(talentsCost))
        ))
      )
    )));
  }
}
