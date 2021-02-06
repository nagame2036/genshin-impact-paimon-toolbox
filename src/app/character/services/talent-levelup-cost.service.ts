import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {TalentLevelupCost} from '../models/talent-level-up-cost.model';
import {HttpClient} from '@angular/common/http';
import {EnemyMaterialService} from '../../material/services/enemy-material.service';
import {MaterialList} from '../../material/models/material-list.model';
import {TalentLevelupMaterialService} from '../../material/services/talent-levelup-material.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {Character} from '../models/character.model';
import {MaterialRequireList} from '../../material/models/material-require-list.model';
import {TalentInformationService} from './talent-information.service';
import {ItemType} from '../../game-common/models/item-type.enum';
import {TalentInfo} from '../models/talent-info.model';

@Injectable({
  providedIn: 'root'
})
export class TalentLevelupCostService {

  private readonly i18n = new I18n('game-common');

  private readonly levels = new ReplaySubject<TalentLevelupCost[]>(1);

  constructor(http: HttpClient, private talents: TalentInformationService, private domain: TalentLevelupMaterialService,
              private enemies: EnemyMaterialService, private logger: NGXLogger) {
    http.get<TalentLevelupCost[]>('assets/data/characters/talent-levelup-cost.json').subscribe(data => {
      this.logger.info('loaded talent levelup cost data', data);
      this.levels.next(data);
    });
  }

  totalRequirements(characters: Character[]): Observable<MaterialRequireList> {
    const requirementObs = characters.map(character => {
      const talentIds = character.info.talentsUpgradable;
      return this.talents.getAll(talentIds).pipe(switchMap(talents => this.requirement(character, talents)));
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
        const cost = new MaterialList();
        const {domain, mob, boss, event} = materials;

        // talent level starts with 1 not 0, so should minus 1
        const start = Math.max(0, progress.talents[id] - 1);
        const goal = Math.max(start, plan.talents[id] - 1);
        const domainLength = domain.length;
        for (let i = start; i < goal; i++) {
          const {mora: moraCost, domain: domainCost, mob: mobCost, boss: bossCost, event: eventCost} = levels[i];
          cost.change(mora.id, moraCost);
          const domainGroupIndex = i % domainLength;
          const domainGroup = domain[domainGroupIndex];
          const domainItem = this.domain.getByGroupAndRarity(domainGroup, domainCost.rarity);
          cost.change(domainItem.id, domainCost.amount);
          const mobItem = this.enemies.getByGroupAndRarity(mob, mobCost.rarity);
          cost.change(mobItem.id, mobCost.amount);
          if (bossCost) {
            cost.change(boss, bossCost);
          }
          if (eventCost) {
            cost.change(event, eventCost);
          }
        }
        const key = plan.id;
        requirement.mark(cost, ItemType.CHARACTER, key, key, this.getLabel(id), [start, goal].map(it => it.toString()));
      }
      return requirement;
    }));
  }
}
