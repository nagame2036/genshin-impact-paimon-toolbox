import {Component, OnInit, ViewChild} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {Subscription} from 'rxjs';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {MaterialService} from '../../services/material.service';
import {NGXLogger} from 'ngx-logger';
import {CraftRecipe, MaterialDetail} from '../../models/material.model';
import {SelectOption} from '../../../widget/models/select-option.model';
import {TranslateService} from '@ngx-translate/core';
import {coerceIn} from '../../../shared/utils/coerce';

@Component({
  selector: 'app-craft-dialog',
  templateUrl: './craft-dialog.component.html',
  styleUrls: ['./craft-dialog.component.scss']
})
export class CraftDialogComponent implements OnInit {

  i18n = new I18n('inventory');

  item!: MaterialDetail;

  recipes: SelectOption[] = [];

  recipe!: CraftRecipe;

  /**
   * the [detail, amount] of material in recipe.
   */
  recipeMaterials: [MaterialDetail, number][] = [];

  details: { usage: MaterialDetail[]; craftableAmount: number }[] = [];

  index = 0;

  performedTimes = 0;

  subscription!: Subscription;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private materials: MaterialService, private translator: TranslateService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  open(item: MaterialDetail): void {
    const recipes = item.recipes;
    if (!recipes) {
      return;
    }
    this.item = item;
    this.performedTimes = 0;
    this.index = 0;
    this.subscription = this.materials.getCraftDetails(this.item).subscribe(details => {
      this.details = details;
      this.recipes = details.map(({usage, craftableAmount}, index) => {
        const key = craftableAmount > 0 ? 'craftable' : 'insufficient';
        const times = this.translator.instant(this.i18n.module(key), {num: craftableAmount});
        const materials = usage.map(({id}) => this.translator.instant(this.i18n.dict(`materials.${id}`))).join(', ');
        return ({text: `${times} - ${materials}`, value: recipes[index]});
      });
      this.changeRecipe(this.recipes[this.index].value);
      this.logger.info('received material craft details', item, details);
    });
    this.dialog.open();
    this.logger.info('opened with item', item);
  }

  close(): void {
    this.subscription?.unsubscribe();
  }

  changeRecipe(recipe: CraftRecipe): void {
    this.index = this.recipes.findIndex(it => it.value === recipe);
    const amount = this.details[this.index].craftableAmount;
    this.performedTimes = coerceIn(this.performedTimes, amount > 0 ? 1 : 0, amount);
    this.recipe = recipe;
    this.recipeMaterials = this.details[this.index].usage.map(it => [it, recipe[it.id] ?? 0]);
  }

  craft(): void {
    this.materials.craft(this.item.id, this.recipe, this.performedTimes);
  }
}
