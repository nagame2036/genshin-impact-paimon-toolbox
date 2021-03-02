import {MaterialDetail} from './material.model';

export interface RequirementDetail {
  text: string;

  value: MaterialDetail[];

  reached: boolean;
}
