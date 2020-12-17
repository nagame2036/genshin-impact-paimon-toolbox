import {animate, style, transition, trigger} from '@angular/animations';

export const addItemDialogAnimation = [
  trigger('listTrigger', [
    transition(':leave', [
      animate('400ms ease-in', style({transform: 'translate(-100%, -120%)'})),
    ]),
    transition(':enter', [
      style({transform: 'translate(-100%, -120%)'}),
      animate('400ms ease-out'), style({transform: 'translate(0, 0)'}),
    ])
  ]),
  trigger('formTrigger', [
    transition(':leave', [
      animate('500ms ease-in', style({opacity: 0}))
    ]),
    transition(':enter', [
      style({opacity: 0}),
      animate('500ms ease-in', style({opacity: 1}))
    ])
  ])
];
