import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {Character, CharacterOverview} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {CharacterInfoService} from './character-info.service';
import {CharacterProgressService} from './character-progress.service';
import {CharacterPlanner} from './character-planner.service';
import {StatsType} from '../../game-common/models/stats.model';
import {TalentInfoService} from './talent-info.service';
import {allAscensions} from '../../game-common/models/ascension.type';
import {CharacterStatsValue} from '../models/character-stats.model';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {MaterialDetail} from '../../material/models/material.model';
import {maxItemLevel} from '../../game-common/models/level.type';
import {ItemService} from '../../game-common/services/item.service';
import {CharacterProgress} from '../models/character-progress.model';
import {CharacterPlan} from '../models/character-plan.model';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root',
})
export class CharacterService extends ItemService<Character, CharacterOverview> {
  constructor(
    private information: CharacterInfoService,
    private progresses: CharacterProgressService,
    private planner: CharacterPlanner,
    private talents: TalentInfoService,
    logger: NGXLogger,
  ) {
    super(ItemType.CHARACTER, progresses, planner, logger);
  }

  create(info: CharacterInfo): CharacterOverview {
    const meta = {id: info.id};
    return this.createItem(info, meta);
  }

  getOverview(character: Character): CharacterOverview {
    return this.information.getOverview(character);
  }

  getStatsAtMaxLevel(character: CharacterInfo): CharacterStatsValue {
    const ascension = allAscensions[allAscensions.length - 1];
    const level = {ascension, level: maxItemLevel};
    return this.information.getStatsValue(character, level);
  }

  getRequireMaterials(character: CharacterInfo): MaterialDetail[] {
    return this.information.getRequireMaterials(character);
  }

  getAllNotInProgress(): Observable<CharacterInfo[]> {
    return combineLatest([this.getIgnoredIds(), this.updated]).pipe(
      map(([ids]) => {
        const progress = this.progresses.progresses;
        const infos = [...this.information.infos.values()];
        return infos.filter(it => !(ids.has(it.id) || progress.has(it.id)));
      }),
    );
  }

  protected initItems(): void {
    const items = this.items;
    const infos = this.information.infos;
    const plans = this.planner.plans;
    for (const [id, progressOrigin] of this.progresses.progresses) {
      const [info, planOrigin] = [infos.get(id), plans.get(id)];
      if (info && planOrigin) {
        const progress = progressOrigin as CharacterProgress;
        const plan = planOrigin as CharacterPlan;
        items.set(id, {info, progress, plan});
      }
    }
  }

  protected calcStatsTypes(id: number): StatsType[] {
    const info = this.information.infos.get(id);
    if (!info) {
      return [];
    }
    return this.getStatsAtMaxLevel(info).getTypes();
  }

  protected getIgnoredIds(): Observable<Set<number>> {
    return this.information.getIgnoredIds();
  }

  protected getItemsNeedUpdate(item: Character): Character[] {
    return this.updateSame(item);
  }

  protected getItemsNeedRemove(items: Character[]): Character[] {
    const characters = [];
    for (const item of items) {
      characters.push(...this.sameLevels(item));
    }
    return characters;
  }

  private updateSame(character: Character): Character[] {
    const results = new Set<Character>();
    const {progress, plan} = character;
    for (const c of this.sameLevels(character)) {
      results.add(c);
      if (c === character) {
        copyLevel(c.progress, progress);
        copyLevel(c.plan, plan);
      }
    }
    for (const c of this.sameTalents(character)) {
      results.add(c);
      if (c !== character) {
        this.talents.copyProgress(c.progress.talents, progress.talents);
        this.talents.copyProgress(c.plan.talents, plan.talents);
      }
    }
    return [...results];
  }

  private sameLevels(target: Character): Character[] {
    return this.getSame(target, this.information.sameLevels);
  }

  private sameTalents(target: Character): Character[] {
    return this.getSame(target, this.information.sameTalents);
  }

  private getSame(target: Character, data: Map<number, number[]>): Character[] {
    const results = [];
    const targetId = target.progress.id;
    const ids = data.get(targetId);
    if (!ids) {
      return [target];
    }
    for (const id of ids) {
      const character = this.items.get(id);
      if (character) {
        results.push(character as Character);
        continue;
      }
      const info = this.information.infos.get(id);
      if (info) {
        const newCharacter = this.create(info);
        this.items.set(newCharacter.progress.id, newCharacter);
        results.push(newCharacter);
      }
    }
    return results;
  }
}

function copyLevel(target: AscensionLevel, source: AscensionLevel): void {
  const {ascension, level} = source;
  Object.assign(target, {ascension, level});
}
