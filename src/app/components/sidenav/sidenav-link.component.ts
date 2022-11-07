import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-link',
  templateUrl: './sidenav-link.component.html',
})
export class SidenavLinkComponent implements OnInit {
  public links: any[] = [
    {
      name: 'Inicio',
      path: '/Inicio',
      icon: 'feather-home',
    },
    {
      name: 'Oficinas',
      path: '/Oficinas',
      icon: 'feather-map-pin',
    },
    {
      name: 'Clientes',
      path: '/Clientes',
      icon: 'feather-users',
    },
    {
      name: 'Cuentas',
      path: '/Cuentas',
      icon: 'feather-credit-card',
    },
    {
      name: 'OTP',
      path: '/OTP',
      icon: 'feather-shield',
    },
  ];
  public collapse: { active: string; current: string; show: boolean } = {
    active: '',
    current: '',
    show: false,
  };

  constructor() {}

  ngOnInit(): void {}

  toggleCollapse(path: string) {
    if (this.collapse.active === '' && this.collapse.current === '') {
      this.collapse = { ...this.collapse, active: path, current: path };
    }

    if (this.collapse.active === path && this.collapse.current === path) {
      this.collapse.show = !this.collapse.show;
    }

    if (this.collapse.active !== path && this.collapse.show) {
      this.collapse = { active: path, current: path, show: true };
    }

    if (this.collapse.active !== path && !this.collapse.show) {
      this.collapse = { active: path, current: path, show: false };
    }
  }
}
