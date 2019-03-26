import { Component, Input, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
  selector: 'kt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IconComponent {
  @Input() name: string;
  @Input() path: Array<string> = [];
  @Input() class: string;

  @HostBinding('class') get iconName(): string {
    return `icon-${this.name} ${this.class || ''}`;
  }
}
