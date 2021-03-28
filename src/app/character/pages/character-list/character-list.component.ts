import {Component, OnInit, ViewChild} from '@angular/core';
import {Character, CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterGridComponent} from '../../components/character-grid/character-grid.component';
import {CharacterService} from '../../services/character.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent implements OnInit {
  i18n = I18n.create('characters');

  characters$!: Observable<CharacterOverview[]>;

  multiSelect = false;

  selectAll = false;

  selectedItems: CharacterOverview[] = [];

  @ViewChild('list')
  list!: CharacterGridComponent;

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

  updateSelected(selected: CharacterOverview[]): void {
    this.logger.info('updated selected characters', selected);
    this.selectedItems = selected;
    this.selectAll =
      this.multiSelect &&
      selected.length > 0 &&
      selected.length === this.list.characters.length;
  }

  onMultiSelect(event: {multiSelect: boolean; selectAll: boolean}): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.list.onMultiSelect(event);
  }
}
