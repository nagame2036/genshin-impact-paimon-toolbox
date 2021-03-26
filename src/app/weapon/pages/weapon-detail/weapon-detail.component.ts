import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {WeaponService} from '../../services/weapon.service';
import {first, switchMap} from 'rxjs/operators';
import {Weapon} from '../../models/weapon.model';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.scss'],
})
export class WeaponDetailComponent implements OnInit {
  readonly i18n = new I18n('weapons');

  weapon!: Weapon;

  weaponId = 0;

  links = [{path: 'plan', text: this.i18n.module('plan.title')}];

  constructor(
    private weapons: WeaponService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => this.weapons.get(Number(params.id))),
        first(),
      )
      .subscribe(
        weapon => {
          this.logger.info('received weapon detail', weapon);
          this.weapon = weapon;
          this.weaponId = weapon.info.id;
        },
        _ => this.router.navigate(['error/404']),
      );
  }

  goBack(): void {
    this.location.back();
  }

  remove(): void {
    this.weapons.removeAll([this.weapon]);
    this.logger.info('removed character', this.weapon);
    this.goBack();
  }
}
