import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  public sidenavShow = true;
  public sidenavContainer = document.querySelector('.sidenav');
  constructor(public sidenavService: SidenavService, public router: Router) {}

  ngOnInit(): void {}

  togglerHandle() {
    if (this.sidenavShow) {
      this.sidenavContainer?.classList.add('sidenav-active');
    } else {
      this.sidenavContainer?.classList.remove('sidenav-active');
    }
    this.sidenavShow = !this.sidenavShow;
  }
}
