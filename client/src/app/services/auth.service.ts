import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AbstractService } from './abstract.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends AbstractService {
    public validate(): Observable<any> {
        const url = `${environment.BASE_URL}/auth`;
        const headers = this.getAuthHeader();

        return this.http
            .get(url, { headers });
    }
}