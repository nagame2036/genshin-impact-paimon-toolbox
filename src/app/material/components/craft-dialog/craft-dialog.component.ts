import {Component, OnDestroy, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialService} from '../../services/material.service';
import {MaterialDetail} from '../../models/material.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {TranslateService} from '@ngx-translate/core';
import {coerceIn} from '../../../shared/utils/coerce';
import {combineLatest, Subscription} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {defaultLocale} from '../../../app-locale.module';
import {CraftDetail, CraftRecipe} from '../../models/craft.type';

@Component({
  selector: 'app-craft-dialog',
  templateUrl: './craft-dialog.component.html',
  styleUrls: ['./craft-dialog.component.scss'],
})
export class CraftDialogComponent implements OnDestroy {
  i18n = I18n.create('inventory');

  item!: MaterialDetail;

  recipes: SelectOption[] = [];

  recipe!: CraftRecipe;

  /**
   * the [detail, amount] of material in recipe.
   */
  materials: [MaterialDetail, number][] = [];

  details: CraftDetail[] = [];

  index = 0;

  /**
   * The craft performed times.
   */
  times = 0;

  subscription?: Subscription;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private service: MaterialService, private translator: TranslateService) {}

  ngOnDestroy(): void {
    this.close();
  }

  open(item: MaterialDetail): void {
    const recipes = item.info.recipes;
    if (!recipes) {
      return;
    }
    this.item = item;
    this.times = 0;
    this.index = 0;
    const details$ = this.service.getCraftDetails(item);
    const locale$ = this.translator.onLangChange.asObservable().pipe(startWith(defaultLocale));
    this.subscription = combineLatest([details$, locale$]).subscribe(([details]) => {
      this.details = details;
      this.recipes = this.recipeOptions(recipes, details);
      this.changeRecipe(this.recipes[this.index].value);
      this.dialog.open();
    });
  }

  close(): void {
    this.subscription?.unsubscribe();
    this.dialog.close();
  }

  changeRecipe(recipe: CraftRecipe): void {
    this.index = this.recipes.findIndex(it => it.value === recipe);
    const {craftableAmount, usage} = this.details[this.index];
    this.times = coerceIn(this.times, 0, craftableAmount);
    this.recipe = recipe;
    this.materials = usage.map(it => [it, recipe[it.info.id] ?? 0]);
  }

  craft(): void {
    this.service.craft(this.item.info.id, this.recipe, this.times);
  }

  private recipeOptions(recipes: CraftRecipe[], details: CraftDetail[]): SelectOption[] {
    return details.map(({usage, craftableAmount}, index) => {
      const key = craftableAmount > 0 ? 'craftable' : 'insufficient';
      const times = this.translator.instant(this.i18n.module(key), {amount: craftableAmount});
      const materials = usage
        .map(({info}) => this.translator.instant(this.i18n.data(`material.${info.id}`)))
        .join(', ');
      return {text: `${times} - ${materials}`, value: recipes[index]};
    });
  }
}
