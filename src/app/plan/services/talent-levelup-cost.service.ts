import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, zip} from 'rxjs';
import {TalentLevelupCost} from '../models/talent-level-up-cost.model';
import {HttpClient} from '@angular/common/http';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';
import {ItemCostList} from '../models/item-cost-list.model';
import {TalentMaterialService} from '../../material/services/talent-material.service';
import {map} from 'rxjs/operators';
import {TalentLevelData} from '../../character-and-gear/models/talent-level-data.model';
import {TalentLevel} from '../../character-and-gear/models/talent-level.type';
import {TalentPlan} from '../models/talent-plan.model';
import {TalentService} from '../../character-and-gear/services/talent.service';

@Injectable({
  providedIn: 'root'
})
export class TalentLevelupCostService {

  private levels = new ReplaySubject<TalentLevelupCost[]>(1);

  constructor(http: HttpClient, private talents: TalentService, private domain: TalentMaterialService,
              private common: CommonMaterialService) {
    http.get<TalentLevelupCost[]>('assets/data/talent-levelup-cost.json').subscribe(res => this.levels.next(res));
  }

  cost(character: PartyCharacter, toLevels: TalentLevelData[]): Observable<ItemCostList> {
    const plans = innerJoinTalentLevels(character.talents, toLevels);
    const cost = new ItemCostList();
    return zip(this.levels, this.domain.items, this.common.items).pipe(
      map(([levels, _, __]) => {
        plans.forEach(it => this.levelupCost(it, levels, cost));
        return cost;
      })
    );
  }

  levelupCost(plan: TalentPlan, levels: TalentLevelupCost[], cost: ItemCostList): void {
    const {id, from, to} = plan;
    const talent = this.talents.getGroupById(id);
    if (!talent) {
      return;
    }
    const domainLen = talent.domain.length;
    for (let i = from; i < to; i++) {
      const {mora, common, domain, boss, event} = levels[i];
      cost.add(0, mora);
      if (domain) {
        // The travelers repeatedly use 3 types of talent domain materials for leveling up their talents
        const group = (i - 1) % domainLen;
        const domainGroup = talent.domain[group];
        const domainItem = this.domain.getByGroupAndRarity(domainGroup, domain.rarity);
        cost.add(domainItem.id, domain.amount);
      }
      if (common) {
        const commonItem = this.common.getByGroupAndRarity(talent.common, common.rarity);
        cost.add(commonItem.id, common.amount);
      }
      if (boss) {
        cost.add(talent.boss, boss);
      }
      if (event) {
        cost.add(talent.event, event);
      }
    }
  }
}

function innerJoinTalentLevels(left: TalentLevelData[], right: TalentLevelData[]): TalentPlan[] {
  const rightMap: { [id: number]: number } = {};
  for (const {id, level} of right) {
    rightMap[id] = level;
  }
  return left.map(it => ({id: it.id, from: it.level, to: (rightMap[it.id] ?? it.level) as TalentLevel}));
}
