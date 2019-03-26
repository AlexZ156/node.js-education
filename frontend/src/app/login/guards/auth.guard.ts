import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class AuthGuard {
  private readonly _loginPath = 'login';

  constructor(
    private _router: Router,
    private _loginService: LoginService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoginPage = this.isLoginPage(route);

    if (!this._loginService.isLoggedIn()) {
      if (!isLoginPage) {
        this.goToLogin();
      }
      return true;
    } else {
      if (isLoginPage) {
        this.goToHome();
      }
      return true;
    }
  }

  goToLogin(): void {
    this._router.navigate(['login', 'signup']);
  }

  goToHome(): void {
    this._router.navigate([''], { replaceUrl: true });
  }

  isLoginPage(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig.path === this._loginPath;
  }
}
