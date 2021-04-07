import {Item} from '../models/item.model';
import {EventEmitter} from '@angular/core';
import {toggleItem} from '../../shared/utils/collections';

export function handleItemGridClick<T extends Item<any>>(
  item: T,
  grid: {
    clicked: T | null;
    selected: T[];
    multiSelect: boolean;
    multiSelected: EventEmitter<T[]>;
  },
): void {
  if (!grid.multiSelect) {
    grid.clicked = grid.clicked === item ? null : item;
    return;
  }
  const id = item.progress.id;
  const list = toggleItem(grid.selected, item, it => it.progress.id === id);
  grid.selected = list;
  grid.clicked = list[list.length - 1] ?? null;
  grid.multiSelected.emit(list);
}
