import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-item-overview-stats-data',
  templateUrl: './item-overview-stats-data.component.html',
  styleUrls: ['./item-overview-stats-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemOverviewStatsDataComponent implements OnInit {
  @Input()
  type = '';

  @Input()
  left: number | null = null;

  @Input()
  right: number | null = null;

  @Input()
  displayRight = false;

  constructor() {}

  ngOnInit(): void {}
}
