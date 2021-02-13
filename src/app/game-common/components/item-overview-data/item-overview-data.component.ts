import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-item-overview-data',
  templateUrl: './item-overview-data.component.html',
  styleUrls: ['./item-overview-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemOverviewDataComponent implements OnInit {

  @Input()
  left!: string | number | null;

  @Input()
  right!: string | number | null;

  @Input()
  displayRight!: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
