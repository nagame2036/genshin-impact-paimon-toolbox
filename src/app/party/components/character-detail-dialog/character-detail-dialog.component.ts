import {Component, Inject, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CharacterService} from '../../../character-and-gear/services/character.service';
import {PartyCharacter} from '../../../character-and-gear/models/party-character.model';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {CharacterPlan} from '../../../plan/models/character-plan.model';

@Component({
  selector: 'app-character-detail-dialog',
  templateUrl: './character-detail-dialog.component.html',
  styleUrls: ['./character-detail-dialog.component.scss']
})
export class CharacterDetailDialogComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.characters';

  constructor(public dialogRef: MatDialogRef<CharacterDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { character: PartyCharacter, plan: CharacterPlan },
              private characterService: CharacterService, private planner: CharacterPlanner) {
    super();
  }

  ngOnInit(): void {
  }

  saveParty(): void {
    this.characterService.updatePartyMember(this.data.character);
  }

  savePlan(): void {
    this.planner.updatePlan(this.data.plan);
  }

  remove(id: number): void {
    this.characterService.removePartyMember(id);
    this.dialogRef.close();
  }
}
