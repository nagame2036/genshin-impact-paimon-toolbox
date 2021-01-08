import {Component, OnInit} from '@angular/core';
import {CharacterStat} from '../../models/character-stat.model';
import {I18n} from '../../../shared/models/i18n.model';
import {CharacterStatComparer} from '../../models/character-stat-comparer.model';
import {FormControl} from '@angular/forms';
import {DamageType} from '../../models/damage-type.enum';
import {AscensionLevel} from '../../../character-and-gear/models/ascension-level.model';
import {CharacterStatProfileService} from '../../services/character-stat-profile.service';

@Component({
  selector: 'app-character-stat-profile',
  templateUrl: './character-stat-profile.component.html',
  styleUrls: ['./character-stat-profile.component.scss']
})
export class CharacterStatProfileComponent implements OnInit {

  i18n = new I18n('character-stat.profile');

  level = new AscensionLevel();

  dmgType = new FormControl(DamageType.PYRO);

  dmgTypes = [
    DamageType.PHYSICAL,
    DamageType.ANEMO,
    DamageType.GEO,
    DamageType.ELECTRO,
    DamageType.HYDRO,
    DamageType.PYRO,
    DamageType.CRYO
  ];

  current = new CharacterStat('current', this.level, this.dmgType, 'right');

  compared = new CharacterStat('compared', this.level, this.dmgType, 'left');

  stat = [this.current, this.compared];

  comparer = new CharacterStatComparer(this.current, this.compared);

  constructor(private profileService: CharacterStatProfileService) {
    this.current.copyTarget = this.compared;
    this.compared.copyTarget = this.current;
  }

  ngOnInit(): void {
    this.profileService.compared.subscribe(c => this.compared.copyFromProfile(c));
    this.calc(true);
  }

  calc(updateProfile: boolean): void {
    this.current.calc();
    this.compared.calc();
    if (updateProfile) {
      this.update();
    }
  }

  copy(stat: CharacterStat): void {
    stat.copy();
    if (stat.copyTarget === this.current) {
      this.update();
    }
  }

  update(): void {
    this.profileService.setCurrent(this.current.profile);
  }
}
