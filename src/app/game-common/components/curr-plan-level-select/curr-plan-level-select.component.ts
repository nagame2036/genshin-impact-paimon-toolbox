import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {
  AscensionLevel,
  AscensionLevelData,
} from '../../models/ascension-level.model';
import {AscensionLevelService} from '../../services/ascension-level.service';

@Component({
  selector: 'app-curr-plan-level-select',
  templateUrl: './curr-plan-level-select.component.html',
  styleUrls: ['./curr-plan-level-select.component.scss'],
})
export class CurrPlanLevelSelectComponent implements OnChanges {
  i18n = new I18n('game-common');

  @Input()
  label!: string;

  @Input()
  currLevel!: AscensionLevel;

  currData!: AscensionLevelData;

  @Input()
  planLevel!: AscensionLevel;

  planData!: AscensionLevelData;

  @Input()
  reached!: boolean;

  @Output()
  currChange = new EventEmitter<AscensionLevel>();

  @Output()
  planChange = new EventEmitter<AscensionLevel>();

  @Output()
  executePlan = new EventEmitter();

  constructor(private service: AscensionLevelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('currLevel')) {
      this.emitCurrChange(this.currLevel);
    }
    if (changes.hasOwnProperty('planLevel')) {
      this.emitPlanChange(this.planLevel);
    }
  }

  checkReached(reached: boolean | null): boolean {
    if (!reached) {
      return false;
    }
    const curr = this.currData;
    const plan = this.planData;
    return curr.ascension !== plan.ascension && curr.level !== plan.level;
  }

  emitCurrChange(value: AscensionLevel): void {
    this.currData = this.service.correct(value);
    this.currChange.emit(this.currData);
    if (this.planData) {
      this.emitPlanChange(this.planData);
    }
  }

  emitPlanChange(value: AscensionLevel): void {
    this.planData = this.service.correct(value, this.currData);
    this.planChange.emit(this.planData);
  }
}
