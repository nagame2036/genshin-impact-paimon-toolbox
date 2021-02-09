import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable, ReplaySubject, zip} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {CharacterAscensionMaterialService} from '../../material/services/character-ascension-material.service';
import {EnemyMaterialService} from '../../material/services/enemy-material.service';
import {MaterialList} from '../../material/models/material-list.model';
import {Character} from '../models/character.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/models/material-require-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CharacterRequirementService {

  private readonly i18n = new I18n('game-common');

  private readonly prefix = 'assets/data/characters';

  private readonly ascensions = new ReplaySubject<CharacterAscensionCost[]>(1);

  /**
   * Stores the cost of exp per level for character level up.
   * @private
   */
  private readonly levels = new ReplaySubject<number[]>(1);

  readonly ascensionLabel = this.i18n.dict('ascension');

  readonly levelupLabel = this.i18n.dict('levelup');

  constructor(http: HttpClient, private exps: CharacterExpMaterialService, private domain: CharacterAscensionMaterialService,
              private enemies: EnemyMaterialService, private logger: NGXLogger) {
    http.get<CharacterAscensionCost[]>(`${this.prefix}/character-ascension-cost.json`).subscribe(data => {
      this.logger.info('loaded character ascension cost data', data);
      this.ascensions.next(data);
    });
    http.get<number[]>(`${this.prefix}/character-levelup-cost.json`).subscribe(data => {
      this.logger.info('loaded character levelup cost data', data);
      this.levels.next(data);
    });
  }

  totalRequirements(characters: Character[]): Observable<MaterialRequireList> {
    const requirementObs = characters.map(character => this.requirement(character));
    return combineLatest(requirementObs).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent total material requirements of all characters', requirements)),
    );
  }

  requirement(character: Character): Observable<MaterialRequireList> {
    const subRequirements = [
      this.ascension(character),
      this.levelup(character),
    ];
    return combineLatest(subRequirements).pipe(
      map((requirements) => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent material requirements of character', character, requirements)),
    );
  }

  private ascension({info: {id, materials}, progress, plan}: Character): Observable<MaterialRequireList> {
    return zip(this.ascensions, this.domain.items, this.enemies.items).pipe(map(([ascensions]) => {
      const {boss, gem, local, mob} = materials;
      const requirement = new MaterialRequireList();
      const cost = new MaterialList();
      const ascensionSlice = ascensions.slice(progress.ascension, plan.ascension);
      for (const ascension of ascensionSlice) {
        const {mora: moraCost, boss: bossCost, gem: gemCost, local: localCost, mob: mobCost} = ascension;
        cost.change(mora.id, moraCost);
        if (boss) {
          cost.change(boss, bossCost);
        }
        const gemItem = this.domain.getByGroupAndRarity(gem, gemCost.rarity);
        cost.change(gemItem.id, gemCost.amount);
        cost.change(local, localCost);
        const mobItem = this.enemies.getByGroupAndRarity(mob, mobCost.rarity);
        cost.change(mobItem.id, mobCost.amount);
      }
      return requirement.mark(cost, ItemType.CHARACTER, id, id, this.ascensionLabel, [progress, plan].map(it => `★${it.ascension}`));
    }));
  }

  private levelup({info, progress, plan}: Character): Observable<MaterialRequireList> {
    return this.levels.pipe(map(levels => {
      const requirement = new MaterialRequireList();
      const cost = new MaterialList();
      const levelSlice = levels.slice(progress.level, plan.level);
      const expCostBase = levelSlice.reduce((sum, curr) => sum + curr, 0);
      const {mora: moraCost, exp: expCost} = processExpBonus(info, expCostBase, v => v * .2);
      cost.change(mora.id, moraCost);
      cost.change(characterExp.id, expCost);
      this.exps.splitExpNeed(cost);
      const {id} = plan;
      return requirement.mark(cost, ItemType.CHARACTER, id, id, this.levelupLabel, [progress, plan].map(it => it.level.toString()));
    }));
  }
}
