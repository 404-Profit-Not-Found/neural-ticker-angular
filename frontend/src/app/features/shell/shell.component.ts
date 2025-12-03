import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  UIShellModule,
  IconModule,
  ThemeModule
} from 'carbon-components-angular';
import { IconService } from 'carbon-components-angular';
import UserAvatar20 from '@carbon/icons/es/user--avatar/20';
import Search20 from '@carbon/icons/es/search/20';
import Notification20 from '@carbon/icons/es/notification/20';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UIShellModule,
    IconModule,
    ThemeModule
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  constructor(protected iconService: IconService) {
    this.iconService.registerAll([UserAvatar20, Search20, Notification20]);
  }
}
