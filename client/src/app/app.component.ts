import { Component, OnInit } from '@angular/core';
import { AccessTokenService } from './shared/components/access-token/access-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TranslationDictionary';

  constructor(private accessTokenService: AccessTokenService) { }

  ngOnInit() {
    this.accessTokenService.checkLocalAccessToken();
  }
}
