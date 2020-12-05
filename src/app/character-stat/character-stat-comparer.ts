import {CharacterStat} from './character-stat';

export class CharacterStatComparer {

  fields = [
    {current: () => this.current.baseAtk.control.value, compared: () => this.compared.baseAtk.control.value},
    {current: () => this.current.plumeAtk.control.value, compared: () => this.compared.plumeAtk.control.value},
    {current: () => this.current.bonusAtk.control.value, compared: () => this.compared.bonusAtk.control.value},
    {current: () => this.current.critRate.control.value, compared: () => this.compared.critRate.control.value},
    {current: () => this.current.critDmgBonus.control.value, compared: () => this.compared.critDmgBonus.control.value},
    {current: () => this.current.elementalDmgBonus.control.value, compared: () => this.compared.elementalDmgBonus.control.value},
    {current: () => this.current.baseDmg, compared: () => this.compared.baseDmg},
    {current: () => this.current.critDmg, compared: () => this.compared.critDmg},
    {current: () => this.current.meanDmg, compared: () => this.compared.meanDmg}
  ];

  constructor(private current: CharacterStat, private compared: CharacterStat) {
  }

  calc(field: { current: () => number, compared: () => number }): number {
    return (field.compared() / field.current() - 1) * 100 || 0;
  }
}
