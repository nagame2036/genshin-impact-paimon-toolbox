import {Injectable} from '@angular/core';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject, zip} from 'rxjs';
import {map} from 'rxjs/operators';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {ElementalMaterialService} from '../../material/services/elemental-material.service';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {ItemCostList} from '../models/item-cost-list.model';
import {PartyCharacter} from '../../character-and-gear/models/party-character.model';

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

  cost(character: PartyCharacter, to: AscensionLevel): Observable<ItemCostList> {
    return zip(this.ascension(character, to.ascension), this.levelup(character.level, to.level)).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(character: PartyCharacter, to: Ascension): Observable<ItemCostList> {
    const cost = new ItemCostList();
    return zip(this.ascensions, this.elements.items, this.common.items).pipe(
      map(([ascensions, _, __]) => {
        ascensions.slice(character.ascension, to).forEach(({mora, elemental, gem, local, enemy}) => {
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

  private levelup(from: number, to: number): Observable<ItemCostList> {
    const cost = new ItemCostList();
    return this.levels.pipe(map(levels => {
      const moraAmount = levels.slice(from, to).reduce((sum, curr) => sum + curr, 0);
      cost.add(0, moraAmount);
      const expAmount = moraAmount * 5;
      cost.add(1, expAmount);
      return cost;
    }));
  }

}
