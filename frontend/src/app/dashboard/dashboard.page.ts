import { Component, ViewChild } from '@angular/core';
import { ellipseGalleryData } from './data/ellipse-gallery-data';
import { EllipseGalleryComponent } from './components/ellipse-gallery/ellipse-gallery.component';
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'kt-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})

export class DashboardPage {
  public ellipseGalleryData = ellipseGalleryData;

  public currentIndex = 0;

  @ViewChild(EllipseGalleryComponent) ellipseGallery: EllipseGalleryComponent;

  constructor(
    private _loginService: LoginService
  ) {}

  goToSlide(index: number) {
    this.ellipseGallery.goToSlide(index);
  }

  logOut(): void {
    this._loginService.logOut();
  }
}
