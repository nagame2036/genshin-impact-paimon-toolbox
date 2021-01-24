import {Component, OnInit, ViewChild} from '@angular/core';
import {Character} from '../../../character/models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {PartyCharacterListComponent} from '../../../character/components/party-character-list/party-character-list.component';
import {CharacterService} from '../../../character/services/character.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-party-character',
  templateUrl: './party-character.component.html',
  styleUrls: ['./party-character.component.scss']
})
export class PartyCharacterComponent implements OnInit {

  i18n = new I18n('characters');

  multiSelect = false;

  selectAll = false;

  selectedItems: Character[] = [];

  @ViewChild('list')
  list!: PartyCharacterListComponent;

  constructor(private router: Router, private service: CharacterService) {
  }

  ngOnInit(): void {
  }

  gotoAdd(): void {
    this.router.navigate(['party/add-character']).then(_ => this.updateSelected([]));
  }

  goToDetail(character: Character): void {
    this.router.navigate(['party/characters', character.id]).then();
  }

  remove(): void {
    this.service.removePartyMemberByList(this.selectedItems.map(it => it.id));
    this.updateSelected([]);
  }

  updateSelected(selected: Character[]): void {
    this.selectedItems = selected;
    this.selectAll = this.multiSelect && selected.length > 0 && selected.length === this.list.characters.length;
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = event.multiSelect;
    this.selectAll = event.selectAll;
    this.list.onMultiSelectChange(event);
  }
}
