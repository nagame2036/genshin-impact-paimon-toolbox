import {Injectable} from '@angular/core';

export type ImageType =
  | 'character-portraits'
  | 'characters'
  | 'elements'
  | 'enemies'
  | 'materials'
  | 'weapon-types'
  | 'weapons';

const characterPortraitMapping = new Map([
  [1002, 1001],
  [1012, 1011],
]);

const characterMapping = new Map([
  [1001, 1001],
  [1011, 1001],
  [1012, 1001],
]);

const materialMapping = new Map([[200, 100]]);

const enemiesMapping = new Map([
  [50101, 50100],
  [50102, 50100],
  [50103, 50100],
  [50105, 50100],
  [50106, 50100],
  [50300, 50100],
  [50302, 50104],
  [50303, 50107],
  [100001, 100000],
  [100002, 100000],
  [100003, 100000],
]);

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly specificImages = new Map<ImageType, Map<number, number>>([
    ['character-portraits', characterPortraitMapping],
    ['characters', characterMapping],
    ['materials', materialMapping],
    ['enemies', enemiesMapping],
  ]);

  constructor() {}

  get(type: ImageType, id: number): string {
    const key = this.specificImages.get(type)?.get(id) ?? id;
    return `assets/images/${type}/${key}.webp`;
  }
}
