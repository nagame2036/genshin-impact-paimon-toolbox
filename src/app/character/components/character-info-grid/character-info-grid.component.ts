import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterInfo} from '../../models/character-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {CharacterViewService} from '../../services/character-view.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-character-info-grid',
  templateUrl: './character-info-grid.component.html',
  styleUrls: ['./character-info-grid.component.scss'],
})
export class CharacterInfoGridComponent
  extends AbstractObservableDirective
  implements OnInit, OnChanges {
  readonly i18n = I18n.create('characters');

  @Input()
  characters: CharacterInfo[] = [];

  items!: CharacterInfo[];

  @Input()
  clickText!: string;

  clicked: CharacterInfo | null = null;

  summaryMaterials!: MaterialDetail[];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<CharacterInfo>();

  private updated$ = new Subject();

  constructor(
    public service: CharacterService,
    public view: CharacterViewService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.updated$
      .pipe(
        switchMap(_ => this.view.viewInfos(this.characters)),
        takeUntil(this.destroy$),
      )
      .subscribe(items => {
        this.items = items;
      });
    this.updated$.next();
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

  click(item: CharacterInfo): void {
    this.logger.info('clicked character', item);
    this.clicked = this.clicked === item ? null : item;
    if (this.clicked) {
      this.summaryMaterials = this.service.getRequireMaterials(item);
    }
  }

  doubleClick(item: CharacterInfo): void {
    this.logger.info('double clicked character', item);
    this.doubleClicked.emit(item);
  }
}
