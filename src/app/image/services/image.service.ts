import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ImageMap} from '../models/image-map.model';
import {from} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly maps = new Map<string, ImageMap>();

  private readonly types = [
    'character-portraits',
    'characters',
    'elements',
    'enemies',
    'materials',
    'weapon-types',
    'weapons'
  ];

  constructor(private http: HttpClient) {
    from(this.types)
      .pipe(
        mergeMap(type => http.get<ImageMap>(`assets/images/${type}/map.json`).pipe(tap(res => this.maps.set(type, res))))
      )
      .subscribe();
  }

  get(type: string, id: number): string {
    return this.maps.get(type)?.[id] ?? '';
  }
}
