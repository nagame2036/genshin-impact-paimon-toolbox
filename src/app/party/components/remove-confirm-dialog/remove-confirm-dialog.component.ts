import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-remove-confirm-dialog',
  templateUrl: './remove-confirm-dialog.component.html',
  styleUrls: ['./remove-confirm-dialog.component.sass']
})
export class RemoveConfirmDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party';

  constructor(private dialog: MatDialogRef<RemoveConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { category: string, items: { id: number, rarity: number }[] }) {
    super();
  }

  ngOnInit(): void {
  }

  close(remove: boolean): void {
    this.dialog.close(remove);
  }

}
