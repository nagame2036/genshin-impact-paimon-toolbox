import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Character} from '../../../shared/models/character';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {CharacterListDialogData} from '../../models/character-list-dialog-data';

@Component({
  selector: 'app-character-list-dialog',
  templateUrl: './character-list-dialog.component.html',
  styleUrls: ['./character-list-dialog.component.sass']
})
export class CharacterListDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  constructor(public dialogRef: MatDialogRef<CharacterListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CharacterListDialogData) {
    super();
  }

  ngOnInit(): void {
  }

  selectCharacter(character: Character): void {
    this.data.action(this.dialogRef, character);
  }

}
