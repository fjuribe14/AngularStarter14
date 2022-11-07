import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { IbpService } from 'src/app/pages/perfil/ibp.service';
import { AlertService } from 'src/app/services/alert.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public firstTime: boolean = true;
  public currentUser: any;
  public currentIbp: any;

  constructor(
    public alertService: AlertService,
    // public authService: AuthService,
    public appConfigService: AppConfigService,
    public router: Router // public model: IbpService
  ) {}

  ngOnInit(): void {
    // this.currentUser = this.authService.usuario;
    // this.model.all(({ data }: { data: any[] }) => {
    //   this.currentIbp = data[0]['nb_ibp'];
    // });
  }

  /**
   * Método que permite ejecutar el cierre de la sesión a partir de los datos
   * del usuario actual, con el uso del servicio de autenticación
   */
  logout(): void {
    // this.alertService
    //   .openModalConfirmation(
    //     'Cerrar sesión',
    //     '¿Está seguro de realizar el cierre de sesión?'
    //   )
    //   .then(
    //     (result) =>
    //       result.isConfirmed &&
    //       this.authService.logout().subscribe(() =>
    //         this.router.navigate(['/Login']).then(() => {
    //           this.alertService.showToast(
    //             'components.auth.sesion.desconexion',
    //             'success'
    //           );
    //         })
    //       ),
    //     () => {}
    //   );
  }
}
