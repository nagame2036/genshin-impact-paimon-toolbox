import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Weapon} from '../../../shared/models/weapon';
import {PartyWeapon} from '../../../shared/models/party-weapon';
import {Ascension} from '../../../shared/models/ascension.enum';
import {RefineRank} from '../../../shared/models/refine-rank';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {WeaponService} from '../../../shared/services/weapon.service';

@Component({
  selector: 'app-party-weapon-list',
  templateUrl: './party-weapon-list.component.html',
  styleUrls: ['./party-weapon-list.component.sass']
})
export class PartyWeaponListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  weapons: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  @Output()
  create = new EventEmitter();

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
}
