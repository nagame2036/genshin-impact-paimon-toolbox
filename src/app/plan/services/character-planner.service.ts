import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterService} from '../../shared/services/character.service';
import {CharacterPlan} from '../models/character-plan.model';
import {Ascension} from '../../shared/models/ascension.enum';
import {TalentService} from '../../shared/services/talent.service';
import {getLevelupPlan} from '../models/levelup-plan.model';
import {TalentLevelData} from '../../shared/models/talent-level-data.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterPlanner {

  private storeName = 'character-plans';

  #plans = new ReplaySubject<CharacterPlan[]>(1);

  plans = this.#plans.asObservable();

  constructor(private database: NgxIndexedDBService, private characters: CharacterService, private talents: TalentService) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
  }

  getPlan(id: number): Observable<CharacterPlan> {
    return this.plans.pipe(map(plans => plans[plans.findIndex(it => it.id === id)]));
  }

  updatePlan(id: number, ascension: Ascension, level: number, talentsData: TalentLevelData[]): void {
    const levelup = getLevelupPlan(ascension, level);
    const talents = this.talents.correctLevels(ascension, talentsData);
    const plan: CharacterPlan = {id, levelup, talents};
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      const newPlans = plans.filter(it => it.id !== id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }
}
