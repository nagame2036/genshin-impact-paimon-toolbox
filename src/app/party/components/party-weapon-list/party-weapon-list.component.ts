import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Weapon} from '../../../character-and-gear/models/weapon.model';
import {PartyWeapon} from '../../../character-and-gear/models/party-weapon.model';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {RefineRank} from '../../../character-and-gear/models/refine-rank.type';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {WeaponService} from '../../../character-and-gear/services/weapon.service';
import {WeaponListComponent} from '../../../character-and-gear/components/weapon-list/weapon-list.component';
import {WeaponPlanDetail} from '../../../plan/models/weapon-plan-detail.model';
import {WeaponPlanner} from '../../../plan/services/weapon-planner.service';
import {first, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-party-weapon-list',
  templateUrl: './party-weapon-list.component.html',
  styleUrls: ['./party-weapon-list.component.sass']
})
export class PartyWeaponListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapons';

  weapons: Weapon[] = [];

  plans = new Map<number, WeaponPlanDetail>();

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
        mergeMap(character => this.planner.getPlan(character.id).pipe(first())),
      )
      .subscribe(res => this.plans.set(res.id, this.planner.getPlanDetail(res)));
  }

  getRefineRank(weapon: Weapon): RefineRank {
    return (weapon as PartyWeapon)?.refine ?? 1;
  }

  getAscension(weapon: Weapon): Ascension {
    return (weapon as PartyWeapon)?.ascension ?? Ascension.ZERO;
  }

  getGoalAscension(weapon: Weapon): Ascension {
    return this.plans.get((weapon as PartyWeapon).key ?? -1)?.ascension ?? Ascension.ZERO;
  }

  getLevel(weapon: Weapon): number {
    return (weapon as PartyWeapon)?.level ?? 1;
  }

  getGoalLevel(weapon: Weapon): number {
    return this.plans.get((weapon as PartyWeapon).key ?? -1)?.level ?? 1;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.list.multiSelect = event.multiSelect;
    this.list.selectAll(event.selectAll);
  }
}
