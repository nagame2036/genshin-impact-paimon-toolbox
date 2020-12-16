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

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openAddCharacter(): void {
    this.dialog.open(AddCharacterDialogComponent, {data: {party: false}});
  }

  openCharacterDetail(character: Character): void {
    this.dialog.open(CharacterDetailDialogComponent, {data: character});
  }
}
