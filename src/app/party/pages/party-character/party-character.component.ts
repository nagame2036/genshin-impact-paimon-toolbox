import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Character} from '../../../character/models/character.model';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyCharacterListComponent} from '../../../character/components/party-character-list/party-character-list.component';
import {RemoveConfirmDialogComponent} from '../../components/remove-confirm-dialog/remove-confirm-dialog.component';
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

  constructor(private dialog: MatDialog, private router: Router, private service: CharacterService) {
  }

  ngOnInit(): void {
  }

  gotoAdd(): void {
    this.router.navigate(['party/add-character']).then(_ => this.updateSelected([]));
  }

  goToDetail(character: Character): void {
    this.router.navigate(['party/characters', character.id]).then();
  }

  openRemoveDialog(): void {
    this.dialog.open(RemoveConfirmDialogComponent, {
      minWidth: '50vw',
      data: {category: 'characters', items: this.selectedItems}
    })
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
