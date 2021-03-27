import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {map, tap} from 'rxjs/operators';
import {WeaponPlan} from '../models/weapon-plan.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {WeaponRequirementService} from './weapon-requirement.service';
import {Weapon} from '../models/weapon.model';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {MaterialService} from '../../material/services/material.service';
import {WeaponInfo} from '../models/weapon-info.model';
import {RequireDetail} from '../../material/models/requirement-detail.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponPlanner {
  private readonly type = ItemType.WEAPON;

  private readonly i18n = I18n.create('game-common');

  private readonly store = 'weapon-plans';

  readonly plans = new Map<number, WeaponPlan>();

  readonly ready = new ReplaySubject(1);

  constructor(
    private weaponReq: WeaponRequirementService,
    private materials: MaterialService,
    private database: NgxIndexedDBService,
    private logger: NGXLogger,
  ) {
    this.database.getAll(this.store).subscribe(plans => {
      this.logger.info('fetched weapon plans', plans);
      for (const p of plans) {
        this.plans.set(p.id, p);
      }
      this.ready.next();
      this.ready.complete();
    });
  }

  create(info: WeaponInfo, id: number): WeaponPlan {
    return {id, weaponId: info.id, ascension: 0, level: 1};
  }

  updateRequire(weapon: Weapon): void {
    const subRequirement = [this.weaponReq.requirement(weapon)];
    const req = new MaterialRequireList(subRequirement);
    this.materials.updateRequire(this.type, weapon.plan.id, req);
    this.logger.info('sent requirement', weapon, req);
  }

  getRequireDetails(weapon: Weapon): Observable<RequireDetail[]> {
    const texts = [
      this.i18n.module('total-requirement'),
      this.weaponReq.levelupLabel,
    ];
    return this.materials
      .getRequireDetails(this.type, weapon.plan.id, texts)
      .pipe(
        tap(req => this.logger.info('sent require detail', weapon, texts, req)),
      );
  }

  update(weapon: Weapon): Observable<void> {
    const plan = weapon.plan;
    return this.database.update(this.store, plan).pipe(
      map(_ => {
        this.logger.info('updated weapon plan', plan);
        this.plans.set(plan.id, plan);
        this.updateRequire(weapon);
      }),
    );
  }

  removeAll(weapons: Weapon[]): Observable<void> {
    const planIds = weapons.map(it => it.plan.id);
    const remove = planIds.map(it => this.database.delete(this.store, it));
    return forkJoin(remove).pipe(
      map(_ => {
        this.logger.info('removed weapon plans', weapons);
        planIds.forEach(it => this.plans.delete(it));
        this.materials.removeAllRequire(this.type, planIds);
      }),
    );
  }
}
