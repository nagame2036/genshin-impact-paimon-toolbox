import {Injectable} from '@angular/core';
import {iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterService} from '../../character-and-gear/services/character.service';
import {CharacterPlan} from '../models/character-plan.model';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {TalentService} from '../../character-and-gear/services/talent.service';
import {getLevelupPlan} from '../models/levelup-plan.model';
import {TalentLevelData} from '../../character-and-gear/models/talent-level-data.model';
import {mergeMap} from 'rxjs/operators';

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
    return this.plans.pipe(mergeMap(plans => {
      const plan = plans[plans.findIndex(it => it.id === id)];
      return iif(() => plan !== undefined, of(plan));
    }));
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
