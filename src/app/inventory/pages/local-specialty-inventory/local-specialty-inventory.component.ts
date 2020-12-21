import {Component, OnInit} from '@angular/core';
import {LocalSpecialtyService} from '../../../material/services/local-specialty.service';
import {LocalSpecialtyItem} from '../../../material/models/local-specialty.model';

@Component({
  selector: 'app-local-specialty-inventory',
  templateUrl: './local-specialty-inventory.component.html',
  styleUrls: ['./local-specialty-inventory.component.sass']
})
export class LocalSpecialtyInventoryComponent implements OnInit {

  items: LocalSpecialtyItem[] = [];

  constructor(private service: LocalSpecialtyService) {
  }

  ngOnInit(): void {
    this.service.items.subscribe(res => this.items = res);
  }

}
