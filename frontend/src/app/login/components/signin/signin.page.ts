import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-sing-in-page',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})

export class SigninPage {
  public name: string;

  public password: string;

  public formValid = true;

  constructor(
    private _router: Router,
    private _loginService: LoginService
  ) {}

  public async signIn() {
    this.formValid = await this._loginService.singIn(this.name, this.password);

    if (this.formValid) {
      this.goToHome();
    }
  }

  goToHome(): void {
    this._router.navigate([''], { replaceUrl: true });
  }
}
