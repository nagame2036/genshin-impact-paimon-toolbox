import {Injectable} from '@angular/core';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {HttpClient} from '@angular/common/http';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {map, reduce, switchMap, take} from 'rxjs/operators';
import {Ascension} from '../../character-and-gear/models/ascension.type';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {CharacterMaterialService} from '../../material/services/character-material.service';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {ItemList} from '../../material/models/item-list.model';
import {PartyCharacter} from '../../character/models/party-character.model';
import {CharacterPlan} from '../models/character-plan.model';
import {processExpBonus} from '../../character-and-gear/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../shared/models/i18n.model';
import {MaterialCostMarker} from '../../material/services/material-cost-marker.service';
import {TranslateService} from '@ngx-translate/core';
import {ItemType} from '../../character-and-gear/models/item-type.enum';
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

  constructor(http: HttpClient, private elements: CharacterMaterialService, private common: CommonMaterialService,
              private exps: CharacterExpMaterialService, private marker: MaterialCostMarker, private translator: TranslateService) {
    http.get<CharacterAscensionCost[]>('assets/data/characters/character-ascension-cost.json').subscribe(res => this.ascensions.next(res));
    http.get<number[]>('assets/data/characters/character-levelup-cost.json').subscribe(res => this.levels.next(res));
  }

  totalCost(plans: { plan: CharacterPlan, party: PartyCharacter }[]): Observable<ItemList> {
    return from(plans).pipe(
      switchMap(({party, plan}) => this.cost(party, new AscensionLevel(plan.ascension, plan.level), true)),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList())
    );
  }

  cost(character: PartyCharacter, goal: AscensionLevel, mark: boolean = false): Observable<ItemList> {
    return combineLatest([this.ascension(character, goal.ascension, mark), this.levelup(character, goal.level, mark)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(character: PartyCharacter, goal: Ascension, mark: boolean): Observable<ItemList> {
    return zip(this.ascensions, this.elements.items, this.common.items).pipe(
      map(([ascensions, _, __]) => {
        const cost = new ItemList();
        const range = ascensions.slice(character.ascension, goal);
        range.forEach(({mora: moraCost, elemental, gem, local, enemy}) => {
          cost.change(mora.id, moraCost);
          if (character.elemental) {
            cost.change(character.elemental, elemental);
          }
          const gemItem = this.elements.getByGroupAndRarity(character.gem, gem.rarity);
          cost.change(gemItem.id, gem.amount);
          cost.change(character.local, local);
          const common = this.common.getByGroupAndRarity(character.common, enemy.rarity);
          cost.change(common.id, enemy.amount);
        });
        return cost;
      }),
      map(cost => this.mark(mark, character, cost, this.ascensionLabel, this.ascensionParam(character.ascension, goal)))
    );
  }

  private ascensionParam(...ascensions: Ascension[]): string[] {
    return ascensions.map(ascension => this.translator.instant(this.i18n.dict(`ascensions.${ascension}`)));
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
