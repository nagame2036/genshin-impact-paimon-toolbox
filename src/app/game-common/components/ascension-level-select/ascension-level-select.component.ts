import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {AscensionLevel, AscensionLevelData} from '../../models/ascension-level.model';
import {AscensionLevelService} from '../../services/ascension-level.service';
import {Ascension} from '../../models/ascension.type';

@Component({
  selector: 'app-ascension-level-select',
  templateUrl: './ascension-level-select.component.html',
  styleUrls: ['./ascension-level-select.component.scss'],
})
export class AscensionLevelSelectComponent implements OnChanges {
  i18n = I18n.create('game-common');

  @Input()
  label = '';

  @Input()
  data: AscensionLevelData = this.service.correct({ascension: 0, level: 1});

  @Input()
  dataStart!: AscensionLevelData;

  ascensionRange = this.data.ascensionRange;

  ascension = this.data.ascension;

  levelRange = this.data.levelRange;

  level = this.data.level;

  valueText = '';

  @Output()
  changed = new EventEmitter<AscensionLevel>();

  hover = false;

  focus = false;

  opened = false;

  constructor(private self: ElementRef, private service: AscensionLevelService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('data') || changes.hasOwnProperty('dataStart')) {
      if (this.data) {
        const data = this.service.correct(this.data, this.dataStart);
        this.update(data);
      }
    }
  }

  changeAscension(value: number): void {
    const level = {ascension: value as Ascension, level: this.level};
    const data = this.service.correct(level, this.dataStart);
    this.update(data);
    this.emitChange();
  }

  changeLevel(value: number): void {
    const level = {ascension: this.ascension, level: value};
    const data = this.service.correct(level, this.dataStart);
    this.update(data);
    this.emitChange();
  }

  @HostListener('window:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.self.nativeElement.contains(event.target)) {
      this.opened = false;
      this.focus = false;
    }
  }

  private update(data: AscensionLevelData): void {
    const {ascensionRange, ascension, levelRange, level} = data;
    this.ascensionRange = ascensionRange;
    this.ascension = ascension;
    this.levelRange = levelRange;
    this.level = level;
    this.valueText = this.service.format(data);
  }

  private emitChange(): void {
    const level = {ascension: this.ascension, level: this.level};
    this.changed.emit(level);
  }
}
