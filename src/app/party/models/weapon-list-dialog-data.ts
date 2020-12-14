import {MatDialogRef} from '@angular/material/dialog';
import {WeaponListDialogComponent} from '../components/weapon-list-dialog/weapon-list-dialog.component';
import {Weapon} from '../../shared/models/weapon';

export interface WeaponListDialogData {

  title: string;

  party: boolean;

  action: (dialog: MatDialogRef<WeaponListDialogComponent>, weapon: Weapon) => void;
}
