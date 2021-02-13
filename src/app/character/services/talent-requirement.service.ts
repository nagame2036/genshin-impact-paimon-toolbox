import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {TalentLevelupCost} from '../models/talent-level-up-cost.model';
import {HttpClient} from '@angular/common/http';
import {EnemyMaterialService} from '../../material/services/enemy-material.service';
import {TalentLevelupMaterialService} from '../../material/services/talent-levelup-material.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {Character} from '../models/character.model';
import {MaterialRequireList} from '../../material/models/material-require-list.model';
import {TalentInfoService} from './talent-info.service';
import {ItemType} from '../../game-common/models/item-type.enum';
import {TalentInfo} from '../models/talent-info.model';
import {MaterialRequireMarkTemp} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';

@Injectable({
  providedIn: 'root'
})
export class TalentRequirementService {

  private readonly i18n = new I18n('game-common');

  private readonly levels = new ReplaySubject<TalentLevelupCost[]>(1);

  constructor(http: HttpClient, private infos: TalentInfoService, private domain: TalentLevelupMaterialService,
              private enemies: EnemyMaterialService, private logger: NGXLogger) {
    http.get<TalentLevelupCost[]>('assets/data/characters/talent-levelup-cost.json').subscribe(data => {
      this.logger.info('loaded talent levelup cost data', data);
      this.levels.next(data);
    });
  }

  totalRequirements(characters: Character[]): Observable<MaterialRequireList> {
    const requirementObs = characters.map(character => {
      const talentIds = character.info.talentsUpgradable;
      return this.infos.getAll(talentIds).pipe(switchMap(talents => this.requirement(character, talents)));
    });
    return combineLatest(requirementObs).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent total material requirements of all talents', requirements)),
    );
  }

  requirement(character: Character, talents: TalentInfo[]): Observable<MaterialRequireList> {
    const subRequirements = [
      this.levelup(character, talents),
    ];
    return combineLatest(subRequirements).pipe(
      map((requirements) => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent material requirements of talents', talents, requirements)),
    );
  }

  getLabel(talentId: number): string {
    return this.i18n.dict(`talent-types.${talentId % 10}`);
  }

  private levelup({progress, plan}: Character, talents: TalentInfo[]): Observable<MaterialRequireList> {
    return combineLatest([this.levels, this.domain.items, this.enemies.items]).pipe(map(([levels]) => {
      const requirement = new MaterialRequireList();
      for (const {id, materials} of talents) {
        if (!materials) {
          continue;
        }
        const {domain, mob, boss, event} = materials;

        // talent level starts with 1 not 0, so should minus 1
        const start = Math.max(0, progress.talents[id] - 1);
        const goal = Math.max(start, plan.talents[id] - 1);
        const mark = generateMark(plan, this.getLabel(id), (start + 1).toString(), (goal + 1).toString());
        const domainLength = domain.length;
        for (let i = start; i < goal; i++) {
          const {mora: moraCost, domain: domainCost, mob: mobCost, boss: bossCost, event: eventCost} = levels[i];
          requirement.mark(mora.id, moraCost, mark);
          const domainGroupIndex = i % domainLength;
          const domainGroup = domain[domainGroupIndex];
          const domainItem = this.domain.getByGroupAndRarity(domainGroup, domainCost.rarity);
          requirement.mark(domainItem.id, domainCost.amount, mark);
          const mobItem = this.enemies.getByGroupAndRarity(mob, mobCost.rarity);
          requirement.mark(mobItem.id, mobCost.amount, mark);
          if (bossCost) {
            requirement.mark(boss, bossCost, mark);
          }
          if (eventCost) {
            requirement.mark(event, eventCost, mark);
          }
        }
      }
      return requirement;
    }));
  }
}

function generateMark(plan: CharacterPlan, purpose: string, start: string, goal: string): MaterialRequireMarkTemp {
  return {type: ItemType.CHARACTER, id: plan.id, key: plan.id, purpose, start, goal};
}
