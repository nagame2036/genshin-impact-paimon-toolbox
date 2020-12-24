import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Weapon} from '../../../character-and-gear/models/weapon.model';
import {PartyWeapon} from '../../../character-and-gear/models/party-weapon.model';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {RefineRank} from '../../../character-and-gear/models/refine-rank.type';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {WeaponService} from '../../../character-and-gear/services/weapon.service';
import {WeaponListComponent} from '../../../character-and-gear/components/weapon-list/weapon-list.component';

@Component({
  selector: 'app-party-weapon-list',
  templateUrl: './party-weapon-list.component.html',
  styleUrls: ['./party-weapon-list.component.sass']
})
export class PartyWeaponListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapons';

  weapons: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

  @Output()
  create = new EventEmitter();

  @ViewChild('list')
  list!: WeaponListComponent;

  constructor(private service: WeaponService) {
    super();
  }

  ngOnInit(): void {
    this.service.party.subscribe(res => this.weapons = res);
  }

  getAscension(weapon: Weapon): Ascension {
    return (weapon as PartyWeapon)?.ascension ?? Ascension.ZERO;
  }

  getLevel(weapon: Weapon): number {
    return (weapon as PartyWeapon)?.level ?? 1;
  }

  getRefineRank(weapon: Weapon): RefineRank {
    return (weapon as PartyWeapon)?.refine ?? 1;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.list.multiSelect = event.multiSelect;
    this.list.selectAll(event.selectAll);
  }
}
