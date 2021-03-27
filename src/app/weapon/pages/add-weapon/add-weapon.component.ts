import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponOverview} from 'src/app/weapon/models/weapon.model';
import {WeaponService} from 'src/app/weapon/services/weapon.service';
import {WeaponInfo} from '../../models/weapon-info.model';
import {Location} from '@angular/common';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-add-weapon',
  templateUrl: './add-weapon.component.html',
  styleUrls: ['./add-weapon.component.scss'],
})
export class AddWeaponComponent implements OnInit {
  readonly i18n = I18n.create('weapons');

  weapons: WeaponInfo[] = [];

  selected = false;

  selectedWeapon!: WeaponOverview;

  constructor(
    private service: WeaponService,
    private location: Location,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.weapons = this.service.infos;
    this.logger.info('init with weapons', this.weapons);
  }

  goBack(): void {
    this.location.back();
  }

  select(weapon: WeaponInfo): void {
    const created = this.service.create(weapon);
    this.selected = true;
    this.selectedWeapon = created;
    this.logger.info('select weapon', created);
  }

  reset(): void {
    this.selected = false;
    this.logger.info('reset');
  }

  add(): void {
    if (this.selected) {
      this.service.update(this.selectedWeapon);
      this.logger.info('added weapon', this.selectedWeapon);
      this.reset();
    }
  }
}
