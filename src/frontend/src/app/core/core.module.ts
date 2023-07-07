import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddTokenInterceptor } from './intercepter/add-token.interceptor';

@NgModule({
  declarations: [],
  imports: [HttpClientModule, CommonModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
