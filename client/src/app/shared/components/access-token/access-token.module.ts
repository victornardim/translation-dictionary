import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AccessTokenComponent } from './access-token.component';
import { AccessTokenService } from './access-token.service';

@NgModule({
    declarations: [
        AccessTokenComponent
    ],
    exports: [
        AccessTokenComponent
    ],
    imports: [
        NgbPopoverModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        AccessTokenService
    ]
})
export class AccessTokenModule { }
