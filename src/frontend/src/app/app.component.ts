import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-boilerplate';

  constructor(private _http: HttpClient, private _authService: AuthService) {}

  ngOnInit() {}
  getToken() {
    this._authService.getToken().subscribe((x) => console.log(x));
  }
  testToken() {
    this._http.post(`${environment.baseUrl}auth/test/`, {}).subscribe((x) => {
      console.log(x);
    });
  }
}
