import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { User } from '../models';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
  private _loginKey = 'kt-user';

  constructor(
    private _router: Router,
    private _storage: LocalStorageService,
    private _cookie: CookieService
  ) {
    if (!this._storage.retrieve(this._loginKey)) {
      this._storage.store(this._loginKey, []);
    }
  }

  public setUser(name: string, password: string): void {
    const storage: User[] = this._storage.retrieve(this._loginKey);

    if (!this.userIsExist(name)) {
      storage.push({name, password});
      this._storage.store(this._loginKey, storage);
      this._cookie.set(this._loginKey, name, 30, '/');
    }
  }

  public userIsExist(name: string): boolean {
    return !!this.getUser(name);
  }

  private getUser(name: string): User | null {
    const storage: User[] = this._storage.retrieve(this._loginKey);
    const user: User = storage.find(usr => usr.name === name);

    return typeof user === 'object' ? user : null;
  }

  public isLoggedIn(): boolean {
    const user = this._cookie.get(this._loginKey);

    return user && this.userIsExist(user);
  }

  public signUp(name: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      if (this.userIsExist(name)) {
        resolve(false);
      } else {
        this.setUser(name, password);
        resolve(true);
      }
    });
  }

  public singIn(name: string, password: string): Promise<boolean> {
    const user = this.getUser(name);

    if (!user) {
      return Promise.resolve(false);
    }

    return new Promise(resolve => {
      if (user.password === password) {
        this._cookie.set(this._loginKey, name, 30, '/');
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  public logOut(): void {
    this._cookie.delete(this._loginKey, '/');
    this.goToLogin();
  }

  goToLogin(): void {
    this._router.navigate(['login', 'signin']);
  }
}
