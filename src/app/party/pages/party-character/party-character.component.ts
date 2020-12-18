import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddCharacterDialogComponent} from '../../components/add-character-dialog/add-character-dialog.component';
import {CharacterDetailDialogComponent} from '../../components/character-detail-dialog/character-detail-dialog.component';
import {Character} from '../../../shared/models/character';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {PartyCharacterListComponent} from '../../components/party-character-list/party-character-list.component';
import {RemoveConfirmDialogComponent} from '../../components/remove-confirm-dialog/remove-confirm-dialog.component';
import {CharacterService} from '../../../shared/services/character.service';

@Component({
  selector: 'app-party-character',
  templateUrl: './party-character.component.html',
  styleUrls: ['./party-character.component.sass']
})
export class PartyCharacterComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  multiSelect = false;

  selectAll = false;

  selectedItems: Character[] = [];

  @ViewChild('list')
  list!: PartyCharacterListComponent;

  constructor(private dialog: MatDialog, private service: CharacterService) {
    super();
  }

  ngOnInit(): void {
  }

  openAddDialog(): void {
    this.dialog.open(AddCharacterDialogComponent).afterClosed().subscribe(_ => this.updateSelected([]));
  }

  openDetail(character: Character): void {
    this.dialog.open(CharacterDetailDialogComponent, {data: character});
  }

  openRemoveDialog(): void {
    this.dialog.open(RemoveConfirmDialogComponent, {data: {category: 'characters', items: this.selectedItems}})
      .afterClosed().subscribe(remove => {
      if (remove) {
        this.service.removePartyMemberByList(this.selectedItems.map(it => it.id));
        this.updateSelected([]);
      }
    });
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
