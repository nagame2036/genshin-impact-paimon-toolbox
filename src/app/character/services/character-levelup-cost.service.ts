import {Injectable} from '@angular/core';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {HttpClient} from '@angular/common/http';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {map, mergeMap, reduce, take, tap} from 'rxjs/operators';
import {Ascension} from '../../game-common/models/ascension.type';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {CharacterAscensionMaterialService} from '../../inventory/services/character-ascension-material.service';
import {EnemiesMaterialService} from '../../inventory/services/enemies-material.service';
import {ItemList} from '../../inventory/models/item-list.model';
import {PartyCharacter} from '../models/party-character.model';
import {CharacterPlan} from '../models/character-plan.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../inventory/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialRequireMarker} from '../../inventory/services/material-require-marker.service';
import {ItemType} from '../../game-common/models/item-type.enum';
import {CharacterExpMaterialService} from '../../inventory/services/character-exp-material.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class CharacterLevelupCostService {

  i18n = new I18n('game-common');

  private ascensions = new ReplaySubject<CharacterAscensionCost[]>(1);

  /**
   * Stores the cost of mora per level for character level up.
   * @private
   */
  private levels = new ReplaySubject<number[]>(1);

  private readonly ascensionLabel = this.i18n.dict('ascension');

  private readonly levelupLabel = this.i18n.dict('levelup');

  constructor(http: HttpClient, private characters: CharacterAscensionMaterialService, private enemies: EnemiesMaterialService,
              private exps: CharacterExpMaterialService, private marker: MaterialRequireMarker, private logger: NGXLogger) {
    http.get<CharacterAscensionCost[]>('assets/data/characters/character-ascension-cost.json').subscribe(data => {
      this.logger.info('loaded character ascension cost data', data);
      this.ascensions.next(data);
    });
    http.get<number[]>('assets/data/characters/character-levelup-cost.json').subscribe(data => {
      this.logger.info('loaded character levelup cost data', data);
      this.levels.next(data);
    });
  }

  totalCost(plans: { plan: CharacterPlan, party: PartyCharacter }[]): Observable<ItemList> {
    return from(plans).pipe(
      mergeMap(({party, plan}) => this.cost(party, new AscensionLevel(plan.ascension, plan.level), true)),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList()),
      tap(cost => this.logger.info('sent total cost of character plans', cost)),
    );
  }

  cost(character: PartyCharacter, goal: AscensionLevel, mark: boolean = false): Observable<ItemList> {
    return combineLatest([this.ascension(character, goal.ascension, mark), this.levelup(character, goal.level, mark)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(character: PartyCharacter, goal: Ascension, mark: boolean): Observable<ItemList> {
    return zip(this.ascensions, this.characters.items, this.enemies.items).pipe(map(([ascensions]) => {
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
      return this.mark(mark, character, cost, this.ascensionLabel, [character.ascension, goal].map(it => `★${it}`));
    }));
  }

  private levelup(character: PartyCharacter, goal: number, mark: boolean): Observable<ItemList> {
    return this.levels.pipe(map(levels => {
      const cost = new ItemList();
      const moraAmount = levels.slice(character.level, goal).reduce((sum, curr) => sum + curr, 0);
      const {mora: moraCost, exp: expCost} = processExpBonus(character, moraAmount, v => v * 5);
      cost.change(mora.id, moraCost);
      cost.change(characterExp.id, expCost);
      const result = this.exps.splitExpNeed(cost);
      return this.mark(mark, character, result, this.levelupLabel, [character.level.toString(), goal.toString()]);
    }));
  }

  private mark(mark: boolean, party: PartyCharacter, cost: ItemList, purpose: string, [start, goal]: string[]): ItemList {
    if (mark) {
      const type = ItemType.CHARACTER;
      const id = party.id;
      this.marker.mark(mark, cost, type, id, id, purpose, [start, goal]);
    }
    return cost;
  }

}
