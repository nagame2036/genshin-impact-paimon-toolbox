import {Component, OnInit} from '@angular/core';
import {CharacterStat} from './character-stat';

@Component({
  selector: 'app-character-stat-form',
  templateUrl: './character-stat-form.component.html',
  styleUrls: ['./character-stat-form.component.sass']
})
export class CharacterStatFormComponent implements OnInit {

  stat = [
    {label: 'current', stat: new CharacterStat()},
    {label: 'new', stat: new CharacterStat()}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
