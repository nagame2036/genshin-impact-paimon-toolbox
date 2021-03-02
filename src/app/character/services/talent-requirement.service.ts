import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {TalentLevelupCost} from '../models/talent-level-up-cost.model';
import {HttpClient} from '@angular/common/http';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {first, map, tap} from 'rxjs/operators';
import {mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {Character} from '../models/character.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {ItemType} from '../../game-common/models/item-type.enum';
import {TalentInfo} from '../models/talent-info.model';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';
import {characterData} from './character-data';

@Injectable({
  providedIn: 'root',
})
export class TalentRequirementService {
  private readonly i18n = new I18n('game-common');

  private readonly levels = new ReplaySubject<TalentLevelupCost[]>(1);

  constructor(
    http: HttpClient,
    private materials: MaterialInfoService,
    private logger: NGXLogger,
  ) {
    http
      .get<TalentLevelupCost[]>(characterData('talent-levelup-cost'))
      .subscribe(data => {
        this.logger.info('loaded talent levelup cost data', data);
        this.levels.next(data);
      });
  }

  requirement(
    character: Character,
    talents: TalentInfo[],
  ): Observable<MaterialRequireList> {
    const subRequirements = [this.levelup(character, talents)];
    return forkJoin(subRequirements).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(req => this.logger.info('sent requirements', talents, req)),
    );
  }

  getLabel(talentId: number): string {
    return this.i18n.dict(`talent-types.${talentId % 10}`);
  }

  private levelup(
    {progress, plan}: Character,
    talents: TalentInfo[],
  ): Observable<MaterialRequireList> {
    return this.levels.pipe(
      first(),
      map(levels => {
        const requirement = new MaterialRequireList();
        for (const {id, materials} of talents) {
          if (!materials) {
            continue;
          }
          const {domain, mob, boss, event} = materials;

          // talent level starts with 1 not 0, so should minus 1
          const start = Math.max(0, progress.talents[id] - 1);
          const goal = Math.max(start, plan.talents[id] - 1);
          const label = this.getLabel(id);
          const mark = generateMark(plan, label, start, goal);
          const domainLength = domain.length;
          for (let i = start; i < goal; i++) {
            const cost = levels[i];
            requirement.mark(mora.id, cost.mora, mark);
            const domainGroupIndex = i % domainLength;
            const domainGroup = domain[domainGroupIndex];
            const domainItem = this.materials.get(
              domainGroup,
              cost.domain.rarity,
            );
            requirement.mark(domainItem.id, cost.domain.amount, mark);
            const mobItem = this.materials.get(mob, cost.mob.rarity);
            requirement.mark(mobItem.id, cost.mob.amount, mark);
            if (cost.boss) {
              requirement.mark(boss, cost.boss, mark);
            }
            if (cost.event) {
              requirement.mark(event, cost.event, mark);
            }
          }
        }
        return requirement;
      }),
    );
  }
}

function generateMark(
  plan: CharacterPlan,
  purpose: string,
  start: number,
  goal: number,
): RequireMark {
  return {
    type: ItemType.CHARACTER,
    id: plan.id,
    key: plan.id,
    purposeType: purpose,
    purpose,
    start: (start + 1).toString(),
    goal: (goal + 1).toString(),
  };
}
