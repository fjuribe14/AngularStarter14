import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  constructor(public appConfigService: AppConfigService) {}

  ngOnInit(): void {}
}
