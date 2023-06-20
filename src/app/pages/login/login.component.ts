import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/crud-maker/services/alert-service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginService as Model } from './login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(
    public model: Model,
    public alertService: AlertService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/Inicio']);
      return;
    }
  }

  public login(): void {
    try {
      this.model.save((response) => {
        this.authService.guardarPayload(response);
        this.authService.guardarTokens(response);
        this.router.navigate(['/Inicio']).then(() => {
          if (response.alertas_password && response.alertas_password.error) {
            this.alertService.showToast(
              response.alertas_password.error,
              'error',
              response.alertas_password.message
            );
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  }
}
