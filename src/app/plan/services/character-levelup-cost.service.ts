import {Injectable} from '@angular/core';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {HttpClient} from '@angular/common/http';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {map, reduce, switchMap, take} from 'rxjs/operators';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {ElementalMaterialService} from '../../material/services/elemental-material.service';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {ItemCostList} from '../models/item-cost-list.model';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';
import {CharacterPlan} from '../models/character-plan.model';
import {toAscensionLevel} from '../models/levelup-plan.model';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {divideExps} from '../utils/divide-exps';
import {processExpBonus} from '../../character-and-gear/models/levelup-exp-bonus.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterLevelupCostService {

  /**
   * Stores the cost of mora per level for character level up.
   * @private
   */
  private levels = new ReplaySubject<number[]>(1);

  private ascensions = new ReplaySubject<CharacterAscensionCost[]>(1);

  constructor(http: HttpClient, private exps: CharacterExpMaterialService, private elements: ElementalMaterialService,
              private common: CommonMaterialService) {
    http.get<number[]>('assets/data/character-levelup-cost.json').subscribe(res => this.levels.next(res));
    http.get<CharacterAscensionCost[]>('assets/data/character-ascension-cost.json').subscribe(res => this.ascensions.next(res));
  }

  totalCost(plans: { plan: CharacterPlan, party: PartyCharacter }[]): Observable<ItemCostList> {
    return from(plans).pipe(
      switchMap(({party, plan}) => this.cost(party, toAscensionLevel(plan.levelup))),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemCostList()),
      switchMap(cost => this.exps.items.pipe(map(
        exps => divideExps(cost.get(1), exps, cost)
      )))
    );
  }

  cost(character: PartyCharacter, goal: AscensionLevel): Observable<ItemCostList> {
    return combineLatest([this.ascension(character, goal.ascension), this.levelup(character, goal.level)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(character: PartyCharacter, goal: Ascension): Observable<ItemCostList> {
    return zip(this.ascensions, this.elements.items, this.common.items).pipe(
      map(([ascensions, _, __]) => {
        const cost = new ItemCostList();
        const range = ascensions.slice(character.ascension, goal);
        range.forEach(({mora, elemental, gem, local, enemy}) => {
          cost.add(0, mora);
          if (character.elemental) {
            cost.add(character.elemental, elemental);
          }
          const gemItem = this.elements.getByGroupAndRarity(character.gem, gem.rarity);
          cost.add(gemItem.id, gem.amount);
          cost.add(character.local, local);
          const common = this.common.getByGroupAndRarity(character.common, enemy.rarity);
          cost.add(common.id, enemy.amount);
        });
        return cost;
      })
    );
  }

  private levelup(character: PartyCharacter, goal: number): Observable<ItemCostList> {
    return this.levels.pipe(map(levels => {
      const cost = new ItemCostList();
      const moraAmount = levels.slice(character.level, goal).reduce((sum, curr) => sum + curr, 0);
      const {mora, exp} = processExpBonus(character, moraAmount, v => v * 5);
      cost.add(0, mora);
      cost.add(1, exp);
      return cost;
    }));
  }

}
