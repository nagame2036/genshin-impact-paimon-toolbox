import {Component, OnInit} from '@angular/core';
import {CharacterAscensionMaterialsService} from '../../../shared/services/character-ascension-materials.service';
import {Rarity} from '../../../shared/models/rarity.enum';
import alasql from 'alasql';

@Component({
  selector: 'app-inventory-character-ascension-materials',
  templateUrl: './inventory-character-ascension-materials.component.html',
  styleUrls: ['./inventory-character-ascension-materials.component.sass']
})
export class InventoryCharacterAscensionMaterialsComponent implements OnInit {

  items: { id: number, rarity: Rarity }[] = [];

  constructor(private materials: CharacterAscensionMaterialsService) {
  }

  ngOnInit(): void {
    this.materials.data.subscribe(data => {
      const items = data.items;
      const ids = Object.keys(items).map(Number);
      const values = ids.map(i => ({id: i, g: items[i].group, rarity: items[i].rarity}));
      console.log(items);
      this.items = alasql('SELECT * FROM ? ORDER BY g, rarity DESC', [values]);
      console.log(this.items);
    });
  }

}
