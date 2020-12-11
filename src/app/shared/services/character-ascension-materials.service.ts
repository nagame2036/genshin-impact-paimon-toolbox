import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CharacterAscensionMaterialsData} from '../models/materials/character-ascension-material';

@Injectable({
  providedIn: 'root'
})
export class CharacterAscensionMaterialsService {

  private data$ = new BehaviorSubject<CharacterAscensionMaterialsData>({groups: {}, items: {}});

  data = this.data$.asObservable();

  constructor(http: HttpClient) {
    http.get('assets/data/character-ascension-materials.json')
      .subscribe(data => this.data$.next(data as CharacterAscensionMaterialsData));
  }
}
