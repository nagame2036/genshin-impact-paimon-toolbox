import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MaterialType} from '../../models/material-type.enum';
import {MaterialDetail} from '../../models/material.model';
import {I18n} from '../../../widget/models/i18n.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {MaterialViewService} from '../../services/material-view.service';
import {MaterialListData} from '../../models/material-list-data.model';
import {allRarities} from '../../../game-common/models/rarity.type';

@Component({
  selector: 'app-material-requirement',
  templateUrl: './material-requirement.component.html',
  styleUrls: ['./material-requirement.component.scss'],
})
export class MaterialRequirementComponent implements OnChanges {
  i18n = I18n.create('inventory');

  @Input()
  types: [string, ...MaterialType[]][] = [];

  @Input()
  requirements!: {text: string; value: MaterialDetail[]}[];

  requirementOptions: SelectOption[] = [];

  materials: MaterialListData[] = [];

  currentIndex = 0;

  detailsEmpty = true;

  constructor(private view: MaterialViewService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('requirements')) {
      const options = [];
      for (let i = 0; i < this.requirements.length; i++) {
        const {text, value} = this.requirements[i];
        if (i === 0 || value.length > 0) {
          options.push({text, value: i});
        }
      }
      this.requirementOptions = options;
      this.changeRequirement(this.currentIndex);
    }
  }

  changeRequirement(index: number): void {
    this.currentIndex = index;
    const requirement = this.requirements[index].value;
    this.detailsEmpty = requirement.length === 0;
    const detailsMap = new Map<string, MaterialDetail[]>();
    for (const material of requirement) {
      for (const [type, ...materialTypes] of this.types) {
        if (materialTypes.includes(material.type)) {
          const details = detailsMap.get(type) ?? [];
          details.push(material);
          detailsMap.set(type, details);
          break;
        }
      }
    }
    this.materials = this.types.map(([type, ...types]) => {
      const details = detailsMap.get(type) ?? [];
      const materials = this.view
        .viewDetails(details, {
          rarities: [...allRarities],
          showOverflow: true,
          conciseMode: false,
        })
        .sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type));
      return {type, materials};
    });
  }
}
