import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthStore } from 'src/app/store/auth.store';
import { justWhitespaceValidator } from '../../validators/just-whitespace.validator';
import { AccessTokenService } from './access-token.service';

@Component({
    selector: 'app-access-token',
    templateUrl: './access-token.component.html',
    styleUrls: ['./access-token.component.css']
})
export class AccessTokenComponent {
    public form: FormGroup;

    public disabled = false;

    constructor(
        private accessTokenService: AccessTokenService,
        private authStore: AuthStore,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.initForm();
        this.listenToDisable();
    }

    private initForm() {
        this.form = this.formBuilder.group({
            token: [this.authStore.getAcessToken(), [Validators.required, justWhitespaceValidator]]
        });
    }

    private listenToDisable() {
        this.accessTokenService
            .listenToDisable()
            .subscribe(disabled => {
                this.disabled = disabled;

                if (disabled) {
                    this.form.disable();
                } else {
                    this.form.enable();
                }
            });
    }

    public save() {
        const token = this.form.controls.token.value;

        if (!token) {
            return;
        }

        this.accessTokenService.save(token);
    }
}