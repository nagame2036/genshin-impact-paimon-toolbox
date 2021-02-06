import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CharacterInfo} from '../models/character-info.model';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {objectMap} from '../../shared/utils/collections';

@Injectable({
  providedIn: 'root'
})
export class CharacterInfoService {

  private readonly prefix = 'assets/data/characters';

  private readonly items$ = new ReplaySubject<Map<number, CharacterInfo>>(1);

  readonly items = this.items$.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<{ [id: number]: CharacterInfo }>(`${this.prefix}/characters.json`).subscribe(data => {
      const characters = objectMap(data);
      this.logger.info('loaded character data', characters);
      this.items$.next(characters);
    });
  }
}
