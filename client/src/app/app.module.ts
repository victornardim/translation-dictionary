import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AlertsModule } from './shared/components/alerts/alerts.module';
import { TranslationsModule } from './pages/translations/translations.module';
import { AuthService } from './services/auth.service';
import { AuthStore } from './store/auth.store';
import { AccessTokenModule } from './shared/components/access-token/access-token.module';
import { HttpErrorInterceptor } from './handlers/http-error.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TranslationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    HttpClientModule,
    AlertsModule,
    AccessTokenModule
  ],
  providers: [
    AuthService,
    AuthStore,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
