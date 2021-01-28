import {Component, OnInit, ViewChild} from '@angular/core';
import {Character} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyCharacterListComponent} from '../../components/party-character-list/party-character-list.component';
import {CharacterService} from '../../services/character.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss']
})
export class CharacterPageComponent implements OnInit {

  i18n = new I18n('characters');

  multiSelect = false;

  selectAll = false;

  selectedItems: Character[] = [];

  @ViewChild('list')
  list!: PartyCharacterListComponent;

  constructor(private service: CharacterService, private router: Router, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  gotoAdd(): void {
    this.router.navigate(['characters/add']).then(_ => this.updateSelected([]));
  }

  goToDetail(character: Character): void {
    this.router.navigate(['characters', character.id]).then();
  }

  remove(): void {
    this.service.removePartyMemberByList(this.selectedItems.map(it => it.id));
    this.logger.info('removed characters', this.selectedItems);
    this.updateSelected([]);
  }

  updateSelected(selected: Character[]): void {
    this.selectedItems = selected;
    this.selectAll = this.multiSelect && selected.length > 0 && selected.length === this.list.characters.length;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.logger.debug(`multi-select: ${this.multiSelect}, select-all: ${this.selectAll}`);
    this.list.onMultiSelectChange(event);
  }
}
