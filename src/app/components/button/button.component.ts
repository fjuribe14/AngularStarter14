import { Component, Input, OnInit } from '@angular/core';
// import { IconsService } from 'src/app/services/icons.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent implements OnInit {
  @Input() class: string = 'btn-dark';
  @Input() disabled: boolean = false;
  @Input() text: any = '';
  @Input() active: boolean = false;
  @Input() icon?: string;
  @Input() iconRight?: boolean;
  @Input() fullWidth?: boolean;
  @Input() tooltip = '';
  @Input() type = '';
  @Input() html = '';
  constructor() {}

  ngOnInit(): void {}
}
