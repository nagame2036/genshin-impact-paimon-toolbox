import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {WeaponService} from '../../../weapon/services/weapon.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {switchMap, takeUntil} from 'rxjs/operators';
import {PartyWeapon} from '../../../weapon/models/party-weapon.model';
import {MatDialog} from '@angular/material/dialog';
import {RemoveConfirmDialogComponent} from '../../components/remove-confirm-dialog/remove-confirm-dialog.component';

@Component({
  selector: 'app-party-weapon-detail',
  templateUrl: './party-weapon-detail.component.html',
  styleUrls: ['./party-weapon-detail.component.scss']
})
export class PartyWeaponDetailComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('party.weapons');

  weapon!: PartyWeapon;

  weaponId = 0;

  weaponKey!: number;

  links = [
    'plan',
  ];

  constructor(private route: ActivatedRoute, private location: Location, private weapons: WeaponService, private dialog: MatDialog) {
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
    this.dialog.open(RemoveConfirmDialogComponent, {
      minWidth: '50vw',
      data: {category: 'weapons', items: [this.weapon]}
    })
      .afterClosed().subscribe(remove => {
      if (remove) {
        this.weapons.removePartyMember(this.weapon);
        this.goBack();
      }
    });
  }

}
