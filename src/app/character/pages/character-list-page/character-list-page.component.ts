import {Component, OnInit, ViewChild} from '@angular/core';
import {Character, CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterListComponent} from '../../components/character-list/character-list.component';
import {CharacterService} from '../../services/character.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-character-list-page',
  templateUrl: './character-list-page.component.html',
  styleUrls: ['./character-list-page.component.scss'],
})
export class CharacterListPageComponent implements OnInit {
  i18n = new I18n('characters');

  characters$!: Observable<CharacterOverview[]>;

  multiSelect = false;

  selectAll = false;

  selectedItems: Character[] = [];

  @ViewChild('list')
  list!: CharacterListComponent;

  constructor(
    private service: CharacterService,
    private router: Router,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.logger.info('init');
    this.characters$ = this.service.getAll();
  }

  gotoAdd(): void {
    this.router.navigate(['characters/add']).then(_ => this.updateSelected([]));
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

  updateSelected(selected: Character[]): void {
    this.logger.info('updated selected characters', selected);
    this.selectedItems = selected;
    this.selectAll =
      this.multiSelect &&
      selected.length > 0 &&
      selected.length === this.list.characters.length;
  }

  onMultiSelectChange(event: {multiSelect: boolean; selectAll: boolean}): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.list.onMultiSelectChange(event);
  }
}
