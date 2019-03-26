import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AuthGuard } from './login/guards/auth.guard';
import { LoginService } from './login/services/login.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWebstorageModule.forRoot()
  ],
  providers: [
    AuthGuard,
    LoginService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
