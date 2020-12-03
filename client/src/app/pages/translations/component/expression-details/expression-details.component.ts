import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expression } from 'src/app/models/translations/expression';
import { ExpressionDetailsService } from './expression-details.service';
import { TranslationsService } from '../../translations.service';

@Component({
    selector: 'app-expression-details',
    templateUrl: './expression-details.component.html',
    styleUrls: ['./expression-details.component.css']
})
export class ExpressionDetailsComponent implements OnInit, OnDestroy {
    constructor(
        private expressionDetailsService: ExpressionDetailsService,
        private translationsService: TranslationsService) { }

    public expression: Expression;

    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.expressionDetailsService
            .listenToOpen()
            .pipe(takeUntil(this.destroy$))
            .subscribe(expression => this.open(expression));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private open(expression: Expression) {
        this.expression = expression;
    }

    public closeModal() {
        this.translationsService.closeModal();
    }
}