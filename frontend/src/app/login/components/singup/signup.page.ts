import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-sing-up-page',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})

export class SignupPage {
  public name: string = '';

  public password: string = '';

  public passwordConfirm: string = '';

  public passwordValid = true;

  public nameValid = true;

  private _passwordLength = 5;

  private _nameLength = 3;

  constructor(
    private _router: Router,
    private _loginService: LoginService
  ) {}

  public async signUp() {
    const isFormValid = this.isFormValid();

    if (isFormValid) {
      const success = await this._loginService.signUp(this.name, this.password);

      if (success) {
        this.goToHome();
      }
    }
  }

  goToHome(): void {
    this._router.navigate(['']);
  }

  isFormValid(): boolean {
    this.passwordValid = this.password.length > this._passwordLength && this.password === this.passwordConfirm;
    this.nameValid = this.name.length > this._nameLength;

    return this.passwordValid && this.nameValid;
  }
}
