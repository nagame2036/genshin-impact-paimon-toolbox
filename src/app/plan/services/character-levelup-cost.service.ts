import {Injectable} from '@angular/core';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {HttpClient} from '@angular/common/http';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {map, mergeMap, reduce, take} from 'rxjs/operators';
import {Ascension} from '../../game-common/models/ascension.type';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {CharacterAscensionMaterialService} from '../../material/services/character-ascension-material.service';
import {EnemiesMaterialService} from '../../material/services/enemies-material.service';
import {ItemList} from '../../material/models/item-list.model';
import {PartyCharacter} from '../../character/models/party-character.model';
import {CharacterPlan} from '../models/character-plan.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialCostMarker} from '../../material/services/material-cost-marker.service';
import {ItemType} from '../../game-common/models/item-type.enum';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterLevelupCostService {

  i18n = new I18n('plan');

  private ascensions = new ReplaySubject<CharacterAscensionCost[]>(1);

  /**
   * Stores the cost of mora per level for character level up.
   * @private
   */
  private levels = new ReplaySubject<number[]>(1);

  private readonly ascensionLabel = this.i18n.module('ascension');

  private readonly levelupLabel = this.i18n.module('levelup');

  constructor(http: HttpClient, private characters: CharacterAscensionMaterialService, private enemies: EnemiesMaterialService,
              private exps: CharacterExpMaterialService, private marker: MaterialCostMarker) {
    http.get<CharacterAscensionCost[]>('assets/data/characters/character-ascension-cost.json').subscribe(res => this.ascensions.next(res));
    http.get<number[]>('assets/data/characters/character-levelup-cost.json').subscribe(res => this.levels.next(res));
  }

  totalCost(plans: { plan: CharacterPlan, party: PartyCharacter }[]): Observable<ItemList> {
    return from(plans).pipe(
      mergeMap(({party, plan}) => this.cost(party, new AscensionLevel(plan.ascension, plan.level), true)),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList()),
    );
  }

  cost(character: PartyCharacter, goal: AscensionLevel, mark: boolean = false): Observable<ItemList> {
    return combineLatest([this.ascension(character, goal.ascension, mark), this.levelup(character, goal.level, mark)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(character: PartyCharacter, goal: Ascension, mark: boolean): Observable<ItemList> {
    return zip(this.ascensions, this.characters.items, this.enemies.items).pipe(
      map(([ascensions, _, __]) => {
        const cost = new ItemList();
        const range = ascensions.slice(character.ascension, goal);
        range.forEach(({mora: moraCost, boss, gem, local, mob}) => {
          cost.change(mora.id, moraCost);
          if (character.boss) {
            cost.change(character.boss, boss);
          }
          const gemItem = this.characters.getByGroupAndRarity(character.gem, gem.rarity);
          cost.change(gemItem.id, gem.amount);
          cost.change(character.local, local);
          const mobItem = this.enemies.getByGroupAndRarity(character.mob, mob.rarity);
          cost.change(mobItem.id, mob.amount);
        });
        return cost;
      }),
      map(cost => this.mark(mark, character, cost, this.ascensionLabel, [character.ascension, goal].map(it => `★${it}`)))
    );
  }

  private levelup(character: PartyCharacter, goal: number, mark: boolean): Observable<ItemList> {
    return this.levels.pipe(
      map(levels => {
        const cost = new ItemList();
        const moraAmount = levels.slice(character.level, goal).reduce((sum, curr) => sum + curr, 0);
        const {mora: moraCost, exp: expCost} = processExpBonus(character, moraAmount, v => v * 5);
        cost.change(mora.id, moraCost);
        cost.change(characterExp.id, expCost);
        return this.exps.splitExpNeed(cost);
      }),
      map(cost => this.mark(mark, character, cost, this.levelupLabel, [character.level.toString(), goal.toString()]))
    );
  }

  private mark(mark: boolean, party: PartyCharacter, cost: ItemList, use: string, [start, goal]: string[]): ItemList {
    const type = ItemType.CHARACTER;
    return this.marker.mark(mark, cost, type, party.id, use, start, goal);
  }

}
