import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TilesModule } from 'carbon-components-angular';

@Component({
  selector: 'app-statistics-tile',
  standalone: true,
  imports: [CommonModule, TilesModule],
  templateUrl: './statistics-tile.component.html',
  styleUrls: ['./statistics-tile.component.scss']
})
export class StatisticsTileComponent {
  @Input() open: number = 0;
  @Input() high: number = 0;
  @Input() low: number = 0;
  @Input() volume: string = '0';
}
