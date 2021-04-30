import {ItemService} from './item.service';
import {Item} from '../models/item.model';
import {ItemInfoService} from './item-info.service';
import {StatsType, StatsValue} from '../models/stats.model';
import {MaterialDetail} from '../../material/models/material.model';
import {allAscensions} from '../models/ascension.type';
import {ItemProgressService} from './item-progress.service';
import {ItemPlanService} from './item-plan.service';
import {NGXLogger} from 'ngx-logger';
import {AscensionLevel} from '../models/ascension-level.model';

type AscendableItemInfoService<T extends Item<T>> = ItemInfoService<T> & {
  getStatsValue(info: T['info'], level: AscensionLevel): StatsValue;

  getRequireMaterials(info: T['info']): MaterialDetail[];
};

export abstract class AscendableItemService<T extends Item<T>, TC = T> extends ItemService<T, TC> {
  protected constructor(
    private baseInfos: AscendableItemInfoService<T>,
    progress: ItemProgressService<T>,
    planner: ItemPlanService<T>,
    logger: NGXLogger,
  ) {
    super(baseInfos, progress, planner, logger);
  }

  getStatsTypes(id: number): StatsType[] {
    const info = this.baseInfos.infos.get(id);
    return info ? this.getStatsAtMaxLevel(info).getTypes() : [];
  }

  getStatsAtMaxLevel(info: T['info']): StatsValue {
    const ascension = allAscensions[allAscensions.length - 1];
    const level = {ascension, level: this.getMaxLevel(info)};
    return this.baseInfos.getStatsValue(info, level);
  }

  getRequireMaterials(info: T['info']): MaterialDetail[] {
    return this.baseInfos.getRequireMaterials(info);
  }
}
