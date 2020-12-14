import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Character} from '../../../shared/models/character';
import {CharacterService} from '../../../shared/services/character.service';

@Component({
  selector: 'app-character-detail-dialog',
  templateUrl: './character-detail-dialog.component.html',
  styleUrls: ['./character-detail-dialog.component.sass']
})
export class CharacterDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  constructor(public dialogRef: MatDialogRef<CharacterDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Character,
              private characters: CharacterService) {
    super();
  }

  ngOnInit(): void {
  }

  removeCharacter(id: number): void {
    this.characters.removePartyMember(id);
    this.dialogRef.close();
  }
}
