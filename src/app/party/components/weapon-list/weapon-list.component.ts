import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import alasql from 'alasql';
import {Weapon} from '../../../shared/models/weapon';
import {WeaponService} from '../../../shared/services/weapon.service';
import {PartyWeapon} from '../../../shared/models/party-weapon';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.sass']
})
export class WeaponListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.weapon';

  @Input()
  party = false;

  private readonly sql = 'SELECT * FROM ? ORDER BY rarity DESC, type, id DESC';

  weapons: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  constructor(private weaponService: WeaponService) {
    super();
  }

  ngOnInit(): void {
    const characters = this.party ? this.weaponService.party : this.weaponService.weapons;
    characters.subscribe(res => this.weapons = alasql(this.sql, [res]));
  }

  selectWeapon(weapon: Weapon): void {
    this.selected.emit(weapon);
  }

  getWeaponLevel(weapon: Weapon): number {
    return (weapon as PartyWeapon)?.level ?? 1;
  }

  getWeaponAscension(weapon: Weapon): number {
    return (weapon as PartyWeapon)?.ascension ?? 0;
  }
}
