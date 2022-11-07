import { Component, OnInit } from '@angular/core';
import { InicioService as Model } from './inicio.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  constructor(public model: Model) {}

  ngOnInit(): void {}
}
