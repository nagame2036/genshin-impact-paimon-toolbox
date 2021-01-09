import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {PartyCharacter} from '../../../character/models/party-character.model';
import {CharacterPlan} from '../../../plan/models/character-plan.model';
import {CharacterService} from '../../../character/services/character.service';
import {CharacterPlanner} from '../../../plan/services/character-planner.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-party-character-plan',
  templateUrl: './party-character-plan.component.html',
  styleUrls: ['./party-character-plan.component.scss']
})
export class PartyCharacterPlanComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('characters');

  party!: PartyCharacter;

  plan!: CharacterPlan;

  constructor(private characterService: CharacterService, private planner: CharacterPlanner, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.parent?.params
      .pipe(switchMap(params => {
        const id = Number(params.id);
        return this.characterService.getPartyCharacter(id).pipe(switchMap(character => {
          this.party = character;
          return this.planner.getPlan(id);
        }));
      }))
      .pipe(takeUntil(this.destroy$))
      .subscribe(plan => this.plan = plan);
  }

  saveParty(): void {
    this.characterService.updatePartyMember(this.party);
  }

  savePlan(): void {
    this.planner.updatePlan(this.plan);
  }

}
