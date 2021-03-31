import {Component, OnInit} from '@angular/core';
import {Character, CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterService} from '../../services/character.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {MultiSelectEvent} from '../../../game-common/models/multi-select-event.model';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('characters');

  items: CharacterOverview[] = [];

  multiSelect = false;

  selectAll = false;

  selectedItems: CharacterOverview[] = [];

  constructor(
    private service: CharacterService,
    private router: Router,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnInit(): void {
    this.logger.info('init');
    this.service
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => (this.items = items));
  }

  gotoAdd(): void {
    this.router.navigate(['characters/add']).then();
  }

  goToDetail(character: Character): void {
    this.router
      .navigate(['characters/progresses', character.progress.id])
      .then();
  }

  remove(): void {
    this.service.removeAll(this.selectedItems);
    this.logger.info('removed characters', this.selectedItems);
    this.updateSelected([]);
  }

  updateSelected(selected: CharacterOverview[]): void {
    this.logger.info('updated selected characters', selected);
    this.selectedItems = selected;
    this.selectAll =
      this.multiSelect &&
      selected.length > 0 &&
      selected.length === this.items.length;
  }

  onMultiSelect(event: MultiSelectEvent): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
  }
}
