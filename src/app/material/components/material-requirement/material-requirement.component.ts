import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MaterialList} from '../../models/material-list.model';
import {MaterialService} from '../../services/material.service';
import {MaterialType} from '../../models/material-type.enum';
import {map} from 'rxjs/operators';
import {MaterialDetail} from '../../models/material.model';
import {combineLatest, Observable} from 'rxjs';
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
  requirements: Observable<{ text: string, value: MaterialList }>[] = [];

  requirementOptions: SelectOption[] = [];

  currentIndex = 0;

  details!: Observable<MaterialDetail[]>[];

  requireDetails$!: Observable<Observable<MaterialDetail[]>[]>;

  constructor(public materials: MaterialService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.details = this.types.map(type => this.materials.getTypes(...type));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('requirements')) {
      this.logger.info('updated requirements', this.requirements);
      combineLatest(this.requirements).subscribe(requirements => {
        this.logger.info('received requirements', requirements);
        this.requirementOptions = requirements.map((it, index) => ({text: it.text, value: index}));
      });
      this.update();
    }
  }

  changeRequirement(index: number): void {
    this.currentIndex = index;
    this.update();
  }

  trackIndex(index: number, _: any): number {
    return index;
  }

  private update(): void {
    const requirement = this.requirements[this.currentIndex];
    this.requireDetails$ = requirement.pipe(map(({value: req}) => {
      return this.details.map(details => details.pipe(map(it => selectRequire(it, req))));
    }));
  }
}

function selectRequire(details: MaterialDetail[], requirement: MaterialList): MaterialDetail[] {
  const results: MaterialDetail[] = [];
  for (const detail of details) {
    const id = detail.id;
    const need = requirement.getAmount(id);
    if (requirement.has(id) && need > 0) {
      let lack = need - detail.have;
      const craftable = Math.max(0, Math.min(lack, detail.craftable));
      lack = Math.max(0, lack - craftable);
      const overflow = lack <= 0;
      results.push({...detail, need, lack, craftable, overflow});
    }
  }
  return results;
}
