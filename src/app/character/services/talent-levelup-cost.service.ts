import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject, zip} from 'rxjs';
import {TalentLevelupCost} from '../models/talent-level-up-cost.model';
import {HttpClient} from '@angular/common/http';
import {EnemiesMaterialService} from '../../inventory/services/enemies-material.service';
import {PartyCharacter} from '../models/party-character.model';
import {ItemList} from '../../inventory/models/item-list.model';
import {TalentLevelupMaterialService} from '../../inventory/services/talent-levelup-material.service';
import {map, mergeMap, reduce, take} from 'rxjs/operators';
import {TalentLevelData} from '../models/talent-level-data.model';
import {TalentLevel} from '../models/talent-level.type';
import {TalentPlan} from '../models/talent-plan.model';
import {TalentService} from './talent.service';
import {CharacterPlan} from '../models/character-plan.model';
import {mora} from '../../inventory/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialCostMarker} from '../../inventory/services/material-cost-marker.service';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TalentLevelupCostService {

  i18n = new I18n('game-common');

  private levels = new ReplaySubject<TalentLevelupCost[]>(1);

  private readonly labels = [
    this.i18n.module('talent-levelup.0'),
    this.i18n.module('talent-levelup.1'),
    this.i18n.module('talent-levelup.2'),
    this.i18n.module('talent-levelup.3'),
    this.i18n.module('talent-levelup.4'),
  ];

  constructor(http: HttpClient, private talents: TalentService, private domain: TalentLevelupMaterialService,
              private enemies: EnemiesMaterialService, private marker: MaterialCostMarker) {
    http.get<TalentLevelupCost[]>('assets/data/characters/talent-levelup-cost.json').subscribe(res => this.levels.next(res));
  }

  totalCost(plans: { plan: CharacterPlan; party: PartyCharacter }[]): Observable<ItemList> {
    return from(plans).pipe(
      mergeMap(({party, plan}) => this.cost(party, plan.talents, true)),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList())
    );
  }

  cost(character: PartyCharacter, goal: TalentLevelData[], mark: boolean = false): Observable<ItemList> {
    return zip(this.levels, this.domain.items, this.enemies.items).pipe(
      map(([levels, _, __]) => {
        const plans = innerJoinTalentLevels(character.talents, goal);
        const cost = new ItemList();
        plans.forEach(it => cost.combine(this.levelup(mark, character, it, levels)));
        return cost;
      }),
    );
  }

  private levelup(mark: boolean, character: PartyCharacter, {id, start, goal}: TalentPlan, levels: TalentLevelupCost[]): ItemList {
    const cost = new ItemList();
    const talent = this.talents.getGroupById(id);
    if (!talent) {
      return cost;
    }
    const domainLen = talent.domain.length;
    const end = goal - 1;
    for (let i = Math.max(0, start - 1); i < end; i++) {
      const {mora: moraCost, mob, domain, boss, event} = levels[i];
      cost.change(mora.id, moraCost);
      // The travelers repeatedly use 3 types of talent domain materials for leveling up their talents
      const group = i % domainLen;
      const domainGroup = talent.domain[group];
      const domainItem = this.domain.getByGroupAndRarity(domainGroup, domain.rarity);
      cost.change(domainItem.id, domain.amount);
      const mobItem = this.enemies.getByGroupAndRarity(talent.mob, mob.rarity);
      cost.change(mobItem.id, mob.amount);
      if (boss) {
        cost.change(talent.boss, boss);
      }
      if (event) {
        cost.change(talent.event, event);
      }
    }
    this.mark(mark, character, cost, this.labels[id % 10], [start.toString(), goal.toString()]);
    return cost;
  }

  private mark(mark: boolean, party: PartyCharacter, cost: ItemList, use: string, [start, goal]: string[]): ItemList {
    const type = ItemType.CHARACTER;
    return this.marker.mark(mark, cost, type, party.id, use, start, goal);
  }
}

function innerJoinTalentLevels(left: TalentLevelData[], right: TalentLevelData[]): TalentPlan[] {
  const rightMap = new Map<number, number>();
  right.forEach(({id, level}) => rightMap.set(id, level));
  return left.map(({id, level}) => ({id, start: level, goal: (rightMap.get(id) ?? level) as TalentLevel}));
}
