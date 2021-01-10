import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject, zip} from 'rxjs';
import {TalentLevelupCost} from '../models/talent-level-up-cost.model';
import {HttpClient} from '@angular/common/http';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {PartyCharacter} from '../../character/models/party-character.model';
import {ItemList} from '../../material/models/item-list.model';
import {TalentMaterialService} from '../../material/services/talent-material.service';
import {map, reduce, switchMap, take} from 'rxjs/operators';
import {TalentLevelData} from '../../character/models/talent-level-data.model';
import {TalentLevel} from '../../character/models/talent-level.type';
import {TalentPlan} from '../models/talent-plan.model';
import {TalentService} from '../../character/services/talent.service';
import {CharacterPlan} from '../models/character-plan.model';
import {mora} from '../../material/models/mora-and-exp.model';

@Injectable({
  providedIn: 'root'
})
export class TalentLevelupCostService {

  private levels = new ReplaySubject<TalentLevelupCost[]>(1);

  constructor(http: HttpClient, private talents: TalentService, private domain: TalentMaterialService,
              private common: CommonMaterialService) {
    http.get<TalentLevelupCost[]>('assets/data/talent-levelup-cost.json').subscribe(res => this.levels.next(res));
  }

  totalCost(plans: { plan: CharacterPlan; party: PartyCharacter }[]): Observable<ItemList> {
    return from(plans).pipe(
      switchMap(({party, plan}) => this.cost(party, plan.talents)),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList())
    );
  }

  cost({talents}: PartyCharacter, goal: TalentLevelData[]): Observable<ItemList> {
    return zip(this.levels, this.domain.items, this.common.items).pipe(
      map(([levels, _, __]) => {
        const plans = innerJoinTalentLevels(talents, goal);
        const cost = new ItemList();
        plans.forEach(it => this.levelup(it, levels, cost));
        return cost;
      })
    );
  }

  private levelup({id, start, goal}: TalentPlan, levels: TalentLevelupCost[], cost: ItemList): void {
    const talent = this.talents.getGroupById(id);
    if (!talent) {
      return;
    }
    const domainLen = talent.domain.length;
    for (let i = start; i < goal; i++) {
      const {mora: moraCost, common, domain, boss, event} = levels[i];
      cost.change(mora.id, moraCost);
      if (domain) {
        // The travelers repeatedly use 3 types of talent domain materials for leveling up their talents
        const group = (i - 1) % domainLen;
        const domainGroup = talent.domain[group];
        const domainItem = this.domain.getByGroupAndRarity(domainGroup, domain.rarity);
        cost.change(domainItem.id, domain.amount);
      }
      if (common) {
        const commonItem = this.common.getByGroupAndRarity(talent.common, common.rarity);
        cost.change(commonItem.id, common.amount);
      }
      if (boss) {
        cost.change(talent.boss, boss);
      }
      if (event) {
        cost.change(talent.event, event);
      }
    }
  }
}

function innerJoinTalentLevels(left: TalentLevelData[], right: TalentLevelData[]): TalentPlan[] {
  const rightMap = new Map<number, number>();
  right.forEach(({id, level}) => rightMap.set(id, level));
  return left.map(({id, level}) => ({id, start: level, goal: (rightMap.get(id) ?? level) as TalentLevel}));
}
