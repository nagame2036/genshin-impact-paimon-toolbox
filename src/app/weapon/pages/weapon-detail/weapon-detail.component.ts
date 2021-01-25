import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {WeaponService} from '../../services/weapon.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {switchMap, takeUntil} from 'rxjs/operators';
import {PartyWeapon} from '../../models/party-weapon.model';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.scss']
})
export class WeaponDetailComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('weapons');

  weapon!: PartyWeapon;

  weaponId = 0;

  weaponKey!: number;

  links = [
    {path: 'plan', text: this.i18n.module('plan.title')},
  ];

  constructor(private route: ActivatedRoute, private location: Location, private weapons: WeaponService) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(params => {
        this.weaponKey = Number(params.id);
        return this.weapons.getPartyWeapon(this.weaponKey);
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(weapon => {
        this.weapon = weapon;
        this.weaponId = weapon.id;
      });
  }

  goBack(): void {
    this.location.back();
  }

  remove(): void {
    this.weapons.removePartyMember(this.weapon);
    this.goBack();
  }

}