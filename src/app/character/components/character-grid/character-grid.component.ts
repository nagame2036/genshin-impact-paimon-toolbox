import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterService} from '../../services/character.service';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterViewService} from '../../services/character-view.service';
import {AscensionLevelService} from '../../../game-common/services/ascension-level.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {MultiSelectEvent} from '../../../game-common/models/multi-select-event.model';
import {handleItemGridClick} from '../../../game-common/utils/handle-item-grid-click';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-character-grid',
  templateUrl: './character-grid.component.html',
  styleUrls: ['./character-grid.component.scss'],
})
export class CharacterGridComponent
  extends AbstractObservableDirective
  implements OnInit, OnChanges {
  readonly i18n = I18n.create('characters');

  @Input()
  characters: CharacterOverview[] = [];

  items!: CharacterOverview[];

  @Input()
  clickText!: string;

  clicked: CharacterOverview | null = null;

  summaryMaterials!: MaterialDetail[];

  @Input()
  selected: CharacterOverview[] = [];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<CharacterOverview>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<CharacterOverview[]>();

  private updated$ = new Subject();

  constructor(
    public service: CharacterService,
    public view: CharacterViewService,
    public level: AscensionLevelService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.updated$
      .pipe(
        switchMap(_ => this.view.view(this.characters)),
        takeUntil(this.destroy$),
      )
      .subscribe(items => {
        this.items = items;
      });
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.characters) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.updated$.next();
  }

  click(item: CharacterOverview): void {
    this.logger.info('clicked character', item);
    handleItemGridClick(item, this);
    if (this.clicked) {
      this.summaryMaterials = this.service.getRequireMaterials(item.info);
    }
  }

  doubleClick(item: CharacterOverview): void {
    this.logger.info('double clicked character', item);
    this.doubleClicked.emit(item);
  }

  onMultiSelect({multiSelect, selectAll}: MultiSelectEvent): void {
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selected = selectAll ? this.characters : [];
    this.multiSelected.emit(this.selected);
  }
}
