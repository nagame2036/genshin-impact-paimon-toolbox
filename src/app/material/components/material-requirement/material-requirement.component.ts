import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MaterialType} from '../../models/material-type.enum';
import {MaterialDetail} from '../../models/material.model';
import {I18n} from '../../../widget/models/i18n.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-material-requirement',
  templateUrl: './material-requirement.component.html',
  styleUrls: ['./material-requirement.component.scss']
})
export class MaterialRequirementComponent implements OnInit, OnChanges {

  i18n = new I18n('inventory');

  @Input()
  subtitles!: string[];

  @Input()
  types: MaterialType[][] = [];

  @Input()
  requirements!: { text: string, value: MaterialDetail[] }[];

  requirementOptions: SelectOption[] = [];

  currentIndex = 0;

  requirementDetails: MaterialDetail[][] = [];

  constructor(private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('requirements')) {
      this.logger.info('received requirements', this.requirements);
      this.requirementOptions = this.requirements.map((it, index) => ({text: it.text, value: index}));
      this.changeRequirement(this.currentIndex);
    }
  }

  changeRequirement(index: number): void {
    this.currentIndex = index;
    const materials = this.requirements[index].value;
    const tempDetails = new Map<MaterialType[], MaterialDetail[]>();
    for (const material of materials) {
      for (const materialTypes of this.types) {
        if (materialTypes.indexOf(material.type) !== -1) {
          const details = tempDetails.get(materialTypes) ?? [];
          details.push(material);
          tempDetails.set(materialTypes, details);
          break;
        }
      }
    }
    this.requirementDetails = this.types.map(it => tempDetails.get(it) ?? []);
  }

  trackIndex(index: number, _: any): number {
    return index;
  }
}
