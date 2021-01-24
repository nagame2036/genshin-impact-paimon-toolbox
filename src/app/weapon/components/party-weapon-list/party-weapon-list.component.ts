import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Weapon} from '../../models/weapon.model';
import {PartyWeapon} from '../../models/party-weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {WeaponListComponent} from '../weapon-list/weapon-list.component';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {map, mergeMap, switchMap, takeUntil, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';

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

  constructor(private weaponService: WeaponService, private planner: WeaponPlanner) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.weaponService.party, this.planner.activePlans])
      .pipe(
        map(it => it[0]),
        tap(party => this.weapons = party),
        switchMap(party => party),
        mergeMap(weapon => this.planner.getPlan(weapon.key ?? -1)),
        takeUntil(this.destroy$)
      )
      .subscribe(plan => this.plans.set(plan.id, plan));
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
