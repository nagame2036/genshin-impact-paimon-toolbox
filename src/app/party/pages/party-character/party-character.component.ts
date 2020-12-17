import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddCharacterDialogComponent} from '../../components/add-character-dialog/add-character-dialog.component';
import {CharacterDetailDialogComponent} from '../../components/character-detail-dialog/character-detail-dialog.component';
import {Character} from '../../../shared/models/character';

@Component({
  selector: 'app-party-character',
  templateUrl: './party-character.component.html',
  styleUrls: ['./party-character.component.sass']
})
export class PartyCharacterComponent implements OnInit {

  i18nKey = 'party.character';

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openAddDialog(): void {
    this.dialog.open(AddCharacterDialogComponent);
  }

  openDetail(character: Character): void {
    this.dialog.open(CharacterDetailDialogComponent, {data: character});
  }
}
