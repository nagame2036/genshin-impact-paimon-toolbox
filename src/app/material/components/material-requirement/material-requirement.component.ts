import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {MaterialType} from '../../models/material-type.enum';
import {MaterialDetail} from '../../models/material.model';
import {I18n} from '../../../widget/models/i18n.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-material-requirement',
  templateUrl: './material-requirement.component.html',
  styleUrls: ['./material-requirement.component.scss'],
})
export class MaterialRequirementComponent implements OnInit, OnChanges {
  i18n = new I18n('inventory');

  @Input()
  types: [string, ...MaterialType[]][] = [];

  @Input()
  requirements!: {text: string; value: MaterialDetail[]}[];

  requirementOptions: SelectOption[] = [];

  currentIndex = 0;

  subtitles: string[] = [];

  details: MaterialDetail[][] = [];

  constructor(private logger: NGXLogger) {}

  ngOnInit(): void {
    this.logger.info('init');
    this.subtitles = this.types.map(([it]) => it);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('requirements')) {
      this.logger.info('received requirements', this.requirements);
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
    const materials = this.requirements[index].value;
    const detailsMap = new Map<string, MaterialDetail[]>();
    for (const material of materials) {
      for (const [type, ...materialTypes] of this.types) {
        if (materialTypes.includes(material.type)) {
          const details = detailsMap.get(type) ?? [];
          details.push(material);
          detailsMap.set(type, details);
          break;
        }
      }
    }
    this.details = this.types.map(([it]) => detailsMap.get(it) ?? []);
  }

  trackIndex(index: number, _: any): number {
    return index;
  }
}
