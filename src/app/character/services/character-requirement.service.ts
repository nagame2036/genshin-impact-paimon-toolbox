import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';
import {CharacterAscensionCost} from '../models/character-ascension-cost.model';
import {CharacterAscensionMaterialService} from '../../material/services/character-ascension-material.service';
import {EnemyMaterialService} from '../../material/services/enemy-material.service';
import {Character} from '../models/character.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {ItemType} from '../../game-common/models/item-type.enum';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';

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

  requirement(character: Character): Observable<MaterialRequireList> {
    const subRequirements = [
      this.ascension(character),
      this.levelup(character),
    ];
    return forkJoin(subRequirements).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent material requirements of character levelup', character, requirements)),
    );
  }

  private ascension({info, progress, plan}: Character): Observable<MaterialRequireList> {
    return zip(this.ascensions, this.domain.items, this.enemies.items).pipe(first(), map(([ascensions]) => {
      const {boss, gem, local, mob} = info.materials;
      const requirement = new MaterialRequireList();
      const mark = generateMark(plan, this.levelupLabel, this.ascensionLabel, `★${progress.ascension}`, `★${plan.ascension}`);
      const ascensionSlice = ascensions.slice(progress.ascension, plan.ascension);
      for (const ascension of ascensionSlice) {
        const {mora: moraCost, boss: bossCost, gem: gemCost, local: localCost, mob: mobCost} = ascension;
        requirement.mark(mora.id, moraCost, mark);
        if (boss) {
          requirement.mark(boss, bossCost, mark);
        }
        const gemItem = this.domain.getByGroupAndRarity(gem, gemCost.rarity);
        requirement.mark(gemItem.id, gemCost.amount, mark);
        requirement.mark(local, localCost, mark);
        const mobItem = this.enemies.getByGroupAndRarity(mob, mobCost.rarity);
        requirement.mark(mobItem.id, mobCost.amount, mark);
      }
      return requirement;
    }));
  }

  private levelup({info, progress, plan}: Character): Observable<MaterialRequireList> {
    return this.levels.pipe(first(), map(levels => {
      const requirement = new MaterialRequireList();
      const mark = generateMark(plan, this.levelupLabel, this.levelupLabel, progress.level.toString(), plan.level.toString());
      const expCostBase = levels.slice(progress.level, plan.level).reduce((sum, curr) => sum + curr, 0);
      const {mora: moraCost, exp: expCost} = processExpBonus(info, expCostBase, v => v * .2);
      requirement.mark(mora.id, moraCost, mark);
      requirement.mark(characterExp.id, expCost, mark);
      this.exps.splitExpNeed(requirement, mark);
      return requirement;
    }));
  }
}

function generateMark(plan: CharacterPlan, purposeType: string, purpose: string, start: string, goal: string): RequireMark {
  return {type: ItemType.CHARACTER, id: plan.id, key: plan.id, purposeType, purpose, start, goal};
}
