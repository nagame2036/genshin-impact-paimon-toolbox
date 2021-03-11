import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialService} from '../../services/material.service';
import {NGXLogger} from 'ngx-logger';
import {CraftRecipe, MaterialDetail} from '../../models/material.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {TranslateService} from '@ngx-translate/core';
import {coerceIn} from '../../../shared/utils/coerce';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-craft-dialog',
  templateUrl: './craft-dialog.component.html',
  styleUrls: ['./craft-dialog.component.scss'],
})
export class CraftDialogComponent implements OnInit, OnDestroy {
  i18n = new I18n('inventory');

  item!: MaterialDetail;

  recipes: SelectOption[] = [];

  recipe!: CraftRecipe;

  /**
   * the [detail, amount] of material in recipe.
   */
  materials: [MaterialDetail, number][] = [];

  details: {usage: MaterialDetail[]; craftableAmount: number}[] = [];

  index = 0;

  /**
   * The craft performed times.
   */
  times = 0;

  subscription?: Subscription;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(
    private service: MaterialService,
    private translator: TranslateService,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    this.logger.info('init');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  open(item: MaterialDetail): void {
    const recipes = item.info.recipes;
    if (!recipes) {
      return;
    }
    this.item = item;
    this.times = 0;
    this.index = 0;
    this.subscription = this.service
      .getCraftDetails(item)
      .subscribe(details => {
        this.details = details;
        this.recipes = this.recipeOptions(recipes, details);
        this.changeRecipe(this.recipes[this.index].value);
        this.logger.info('received material craft details', item, details);
        this.dialog.open();
      });
  }

  close(): void {
    this.subscription?.unsubscribe();
    this.dialog.close();
  }

  changeRecipe(recipe: CraftRecipe): void {
    this.index = this.recipes.findIndex(it => it.value === recipe);
    const detail = this.details[this.index];
    const amount = detail.craftableAmount;
    const minAmount = amount > 0 ? 1 : 0;
    this.times = coerceIn(this.times, minAmount, amount);
    this.recipe = recipe;
    this.materials = detail.usage.map(it => [it, recipe[it.info.id] ?? 0]);
  }

  craft(): void {
    this.service.craft(this.item.info.id, this.recipe, this.times);
  }

  private recipeOptions(
    recipes: CraftRecipe[],
    details: {usage: MaterialDetail[]; craftableAmount: number}[],
  ): SelectOption[] {
    return details.map(({usage, craftableAmount}, index) => {
      const key = craftableAmount > 0 ? 'craftable' : 'insufficient';
      const params = {amount: craftableAmount};
      const times = this.translator.instant(this.i18n.module(key), params);
      const materials = usage
        .map(({info}) => {
          return this.translator.instant(
            this.i18n.dict(`materials.${info.id}`),
          );
        })
        .join(', ');
      return {text: `${times} - ${materials}`, value: recipes[index]};
    });
  }
}
