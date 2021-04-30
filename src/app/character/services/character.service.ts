import {Injectable} from '@angular/core';
import {Character} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {NGXLogger} from 'ngx-logger';
import {CharacterInfoService} from './character-info.service';
import {CharacterProgressService} from './character-progress.service';
import {CharacterPlanner} from './character-planner.service';
import {TalentInfoService} from './talent-info.service';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {AscendableItemService} from '../../game-common/services/ascendable-item.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService extends AscendableItemService<Character> {
  constructor(
    private infos: CharacterInfoService,
    private progresses: CharacterProgressService,
    private planner: CharacterPlanner,
    private talents: TalentInfoService,
    logger: NGXLogger,
  ) {
    super(infos, progresses, planner, logger);
  }

  create(info: CharacterInfo): Character {
    const meta = {id: info.id};
    return this.createItem(info, meta);
  }

  protected initItems(): void {
    const infos = this.infos.infos;
    const plans = this.planner.plans;
    for (const [id, progress] of this.progresses.progresses) {
      const [info, plan] = [infos.get(id), plans.get(id)];
      if (info && plan) {
        this.items.set(id, this.infos.refresh(info, progress, plan));
      }
    }
  }

  protected getAddableInfos(ignoreIds: Set<number>): CharacterInfo[] {
    const progress = this.progresses.progresses;
    return this.infosInArray.filter(it => !(ignoreIds.has(it.id) || progress.has(it.id)));
  }

  protected getItemsNeedUpdate(item: Character): Character[] {
    const results = new Set<Character>();
    const {progress, plan} = item;
    for (const c of this.getSame(item, this.infos.sameLevels)) {
      results.add(c);
      if (c !== item) {
        copyLevel(c.progress, progress);
        copyLevel(c.plan, plan);
      }
    }
    for (const c of this.getSame(item, this.infos.sameTalents)) {
      results.add(c);
      if (c !== item) {
        this.talents.copyProgress(c.progress, progress);
        this.talents.copyProgress(c.plan, plan);
      }
    }
    return [...results];
  }

  protected getItemsNeedRemove(items: Character[]): Character[] {
    return items.flatMap(it => this.getSame(it, this.infos.sameLevels));
  }

  private getSame(item: Character, data: Map<number, number[]>): Character[] {
    const ids = data.get(item.progress.id);
    if (!ids) {
      return [item];
    }
    const results = [];
    for (const id of ids) {
      const character = this.items.get(id);
      if (character) {
        results.push(character);
        continue;
      }
      const info = this.infos.infos.get(id);
      if (info) {
        const same = this.create(info);
        this.items.set(same.progress.id, same);
        results.push(same);
      }
    }
    return results;
  }
}

function copyLevel(target: AscensionLevel, {ascension, level}: AscensionLevel): void {
  Object.assign(target, {ascension, level});
}
