import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Weapon} from '../../models/weapon.model';
import {PartyWeapon} from '../../models/party-weapon.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {WeaponService} from '../../services/weapon.service';
import {WeaponListComponent} from '../weapon-list/weapon-list.component';
import {WeaponPlan} from '../../../plan/models/weapon-plan.model';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {first, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-party-weapon-list',
  templateUrl: './party-weapon-list.component.html',
  styleUrls: ['./party-weapon-list.component.scss']
})
export class PartyWeaponListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'weapons';

  weapons: Weapon[] = [];

  plans = new Map<number, WeaponPlan>();

  @Output()
  selected = new EventEmitter<Weapon>();

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

  @Output()
  create = new EventEmitter();

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
        mergeMap(weapon => this.planner.getPlan(weapon.key ?? -1).pipe(first())),
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
