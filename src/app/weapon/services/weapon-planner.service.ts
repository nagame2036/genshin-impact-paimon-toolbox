import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
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
import {RequirementDetail} from '../../material/models/requirement-detail.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponPlanner {

  private readonly i18n = new I18n('game-common');

  private readonly store = 'weapon-plans';

  private readonly plans$ = new ReplaySubject<Map<number, WeaponPlan>>(1);

  readonly plans = this.plans$.asObservable();

  constructor(private weaponReq: WeaponRequirementService, private materials: MaterialService,
              private database: NgxIndexedDBService, private logger: NGXLogger) {
    this.database.getAll(this.store).subscribe(persisted => {
      this.logger.info('fetched weapon plans', persisted);
      const plans = new Map<number, WeaponPlan>();
      persisted.forEach(p => plans.set(p.id, p));
      this.plans$.next(plans);
    });
  }

  create(info: WeaponInfo, id: number): WeaponPlan {
    return {id, weaponId: info.id, ascension: 0, level: 1};
  }

  getRequirement(weapon: Weapon): Observable<MaterialRequireList> {
    const subRequirement = [
      this.weaponReq.requirement(weapon),
    ];
    return forkJoin(subRequirement).pipe(
      map((requirements) => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent material requirements of weapon', weapon, requirements)),
    );
  }

  getRequirementDetails(weapon: Weapon): Observable<RequirementDetail[]> {
    return this.materials.getRequirements(ItemType.WEAPON, weapon.plan.id).pipe(map(requirements => {
      const texts = [
        this.i18n.module('total-requirement'),
        this.weaponReq.levelupLabel,
      ];
      this.logger.info('sent specific material requirements of weapon', weapon, texts, requirements);
      return requirements.sort((a, b) => texts.indexOf(a.text) - texts.indexOf(b.text));
    }));
  }

  update({plan}: Weapon): Observable<void> {
    const update = this.database.update(this.store, plan);
    return zip(update, this.plans).pipe(map(([, plans]) => {
      this.logger.info('updated weapon plan', plan);
      plans.set(plan.id, plan);
      this.plans$.next(plans);
    }));
  }

  remove({plan}: Weapon): Observable<void> {
    const id = plan.id;
    const remove = this.database.delete(this.store, id);
    return zip(remove, this.plans).pipe(map(([, plans]) => {
      this.logger.info('removed weapon plan', plan);
      plans.delete(id);
      this.plans$.next(plans);
    }));
  }

  removeAll(weapons: Weapon[]): Observable<void> {
    const remove = weapons.map(it => this.database.delete(this.store, it.plan.id));
    return zip(forkJoin(remove), this.plans).pipe(map(([, plans]) => {
      this.logger.info('removed weapon plans', weapons);
      weapons.forEach(it => plans.delete(it.plan.id));
      this.plans$.next(plans);
    }));
  }
}
