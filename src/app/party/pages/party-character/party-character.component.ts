import {Component, OnInit} from '@angular/core';
import {CharacterService} from '../../../shared/services/character.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CharacterListDialogComponent} from '../../components/character-list-dialog/character-list-dialog.component';
import {CharacterDetailDialogComponent} from '../../components/character-detail-dialog/character-detail-dialog.component';
import {Character} from '../../../shared/models/character';

@Component({
  selector: 'app-party-character',
  templateUrl: './party-character.component.html',
  styleUrls: ['./party-character.component.sass']
})
export class PartyCharacterComponent implements OnInit {

  constructor(private dialog: MatDialog, private characters: CharacterService) {
  }

  ngOnInit(): void {
  }

  openAddCharacter(): void {
    this.dialog.open(CharacterListDialogComponent, {
      width: '1920px',
      data: {
        title: 'add-character',
        party: false,
        action: (dialog: MatDialogRef<CharacterListDialogComponent>, character: Character) => {
          this.characters.addPartyMember(character.id);
        }
      }
    });
  }

  openCharacterDetail(character: Character): void {
    this.dialog.open(CharacterDetailDialogComponent, {width: '240px', data: character});
  }
}
