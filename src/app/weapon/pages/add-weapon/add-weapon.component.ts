import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Weapon} from 'src/app/weapon/models/weapon.model';
import {WeaponService} from 'src/app/weapon/services/weapon.service';
import {takeUntil} from 'rxjs/operators';
import {WeaponInfo} from '../../models/weapon-info.model';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {Location} from '@angular/common';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-add-weapon',
  templateUrl: './add-weapon.component.html',
  styleUrls: ['./add-weapon.component.scss']
})
export class AddWeaponComponent extends AbstractObservableComponent implements OnInit {

  readonly i18n = new I18n('weapons');

  weapons: WeaponInfo[] = [];

  selected = false;

  selectedWeapon!: Weapon;

  constructor(private service: WeaponService, private location: Location, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.service.nonParty
      .pipe(takeUntil(this.destroy$))
      .subscribe(weapons => {
        this.logger.info('received non-party weapons', weapons);
        this.weapons = weapons;
      });
  }

  goBack(): void {
    this.location.back();
  }

  select(weapon: WeaponInfo): void {
    this.selected = true;
    this.selectedWeapon = this.service.create(weapon);
    this.logger.info('select weapon', weapon);
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
