import {MatDialogRef} from '@angular/material/dialog';
import {CharacterListDialogComponent} from '../components/character-list-dialog/character-list-dialog.component';
import {Character} from '../../shared/models/character';

export interface CharacterListDialogData {

  title: string;

  party: boolean;

  action: (dialog: MatDialogRef<CharacterListDialogComponent>, character: Character) => void;
}
