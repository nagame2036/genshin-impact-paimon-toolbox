import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-remove-confirm-dialog',
  templateUrl: './remove-confirm-dialog.component.html',
  styleUrls: ['./remove-confirm-dialog.component.scss']
})
export class RemoveConfirmDialogComponent implements OnInit {

  i18n = new I18n('party');

  constructor(private dialog: MatDialogRef<RemoveConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { category: string, items: { id: number, rarity: number }[] }) {
  }

  ngOnInit(): void {
  }

  close(remove: boolean): void {
    this.dialog.close(remove);
  }

}
