import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Weapon} from '../../models/weapon.model';
import {PartyWeapon} from '../../models/party-weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponListComponent} from '../weapon-list/weapon-list.component';
import {WeaponPlan} from '../../models/weapon-plan.model';
import {WeaponPlanner} from '../../services/weapon-planner.service';
import {mergeMap, switchMap, takeUntil, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-party-weapon-list',
  templateUrl: './party-weapon-list.component.html',
  styleUrls: ['./party-weapon-list.component.scss']
})
export class PartyWeaponListComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('weapons');

  weapons: Weapon[] = [];

  plans = new Map<number, WeaponPlan>();

  @Input()
  selectedItems: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

  @Output()
  add = new EventEmitter();

  @ViewChild('list')
  list!: WeaponListComponent;

  constructor(private weaponService: WeaponService, private planner: WeaponPlanner, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.weaponService.party, this.planner.activePlans])
      .pipe(
        tap(([party]) => {
          this.logger.info('received party weapon', party);
          this.weapons = party;
        }),
        switchMap(([party]) => party),
        mergeMap(weapon => this.planner.getPlan(weapon.key ?? -1)),
        takeUntil(this.destroy$)
      )
      .subscribe(plan => {
        this.plans.set(plan.id, plan);
        this.logger.info('received weapon plan', plan);
      });
  }

  getParty(weapon: Weapon): PartyWeapon {
    return weapon as PartyWeapon;
  }

  getPlan(weapon: PartyWeapon): WeaponPlan | undefined {
    return this.plans.get(weapon.key ?? -1);
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.list.multiSelect = event.multiSelect;
    this.list.selectAll(event.selectAll);
  }
}
