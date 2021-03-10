import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterInfo} from '../../models/character-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {CharacterViewService} from '../../services/character-view.service';

@Component({
  selector: 'app-character-info-list',
  templateUrl: './character-info-list.component.html',
  styleUrls: ['./character-info-list.component.scss'],
})
export class CharacterInfoListComponent implements OnChanges {
  readonly i18n = new I18n('characters');

  @Input()
  characters: CharacterInfo[] = [];

  items!: CharacterInfo[];

  @Output()
  selected = new EventEmitter<CharacterInfo>();

  constructor(
    private service: CharacterService,
    public view: CharacterViewService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('characters')) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.view.viewInfos(this.characters).subscribe(items => {
      this.items = items;
    });
  }

  select(item: CharacterInfo): void {
    this.logger.info('selected character', item);
    this.selected.emit(item);
  }
}
