import {Injectable} from '@angular/core';
import {combineLatest, EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {map, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {WeaponPlan} from '../models/weapon-plan.model';
import {MaterialList} from '../../material/models/material-list.model';
import {WeaponRequirementService} from './weapon-requirement.service';
import {Weapon} from '../models/weapon.model';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {MaterialService} from '../../material/services/material.service';
import {WeaponInfo} from '../models/weapon-info.model';
import {MaterialRequireList} from '../../material/models/material-require-list.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponPlanner {

  private readonly i18n = new I18n('game-common');

  private readonly store = 'weapon-plans';

  private readonly plans$ = new ReplaySubject<Map<number, WeaponPlan>>(1);

  readonly plans = this.plans$.asObservable();

  constructor(private requirement: WeaponRequirementService, private materials: MaterialService,
              private database: NgxIndexedDBService, private logger: NGXLogger) {
    this.database.getAll(this.store).subscribe(persisted => {
      this.logger.info('fetched character plans', persisted);
      const plans = new Map<number, WeaponPlan>();
      persisted.forEach(p => plans.set(p.id, p));
      this.plans$.next(plans);
    });
  }

  create(info: WeaponInfo, id: number): WeaponPlan {
    return {id, weaponId: info.id, ascension: 0, level: 1};
  }

  get(id: number): Observable<WeaponPlan> {
    return this.plans.pipe(
      switchMap(plans => {
        const plan = plans.get(id);
        return plan ? of(plan) : EMPTY;
      }),
      throwIfEmpty()
    );
  }

  update({plan}: Weapon): void {
    const update = this.database.update(this.store, plan);
    zip(update, this.plans).subscribe(([, plans]) => {
      this.logger.info('updated weapon plan', plan);
      plans.set(plan.id, plan);
      this.plans$.next(plans);
    });
  }

  remove({plan}: Weapon): void {
    const id = plan.id;
    const remove = this.database.delete(this.store, id);
    zip(remove, this.plans).subscribe(([, plans]) => {
      this.logger.info('removed weapon plan', plan);
      plans.delete(id);
      this.plans$.next(plans);
    });
  }

  removeAll(weapons: Weapon[]): void {
    const remove = weapons.map(it => this.database.delete(this.store, it.plan.id));
    zip(forkJoin(remove), this.plans).subscribe(([, plans]) => {
      this.logger.info('removed weapon plans', weapons);
      weapons.forEach(it => plans.delete(it.plan.id));
      this.plans$.next(plans);
    });
  }

  totalRequirements(weapons: Weapon[]): Observable<MaterialRequireList> {
    const subRequirements = [
      this.requirement.totalRequirements(weapons),
    ];
    return combineLatest(subRequirements).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent total material requirements of all weapon plans', requirements))
    );
  }

  specificRequirements(weapon: Weapon): Observable<{ text: string, value: MaterialList, satisfied: boolean }>[] {
    const levelupTexts = [this.requirement.levelupLabel, this.requirement.ascensionLabel];
    const texts = [
      [
        this.i18n.module('total-requirement'),
        ...levelupTexts
      ],
    ];
    this.logger.info('sent specific material requirements of weapon', weapon, texts);
    return texts.map(it => this.materials.getRequirements(ItemType.WEAPON, weapon.plan.id, it));
  }
}
