import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Expression } from 'src/app/models/translations/expression';
import { Language } from 'src/app/models/translations/language';
import { AppStateService } from 'src/app/services/app-state.service';
import { AppState } from 'src/app/shared/app-state.enum';
import { TranslationsStore } from 'src/app/store/translations.store';

@Component({
    selector: 'app-expressions-table',
    templateUrl: './expressions-table.component.html',
    styleUrls: ['./expressions-table.component.css']
})
export class ExpressionsTableComponent implements OnInit, OnDestroy {
    @Input() expressions: Expression[];
    @Input() selectedLanguages: Language[];
    @Input() isFiltering: boolean;

    @Output() edit = new EventEmitter<Expression>();
    @Output() delete = new EventEmitter<Expression>();
    @Output() showDetails = new EventEmitter<Expression>();
    @Output() changeOrdering = new EventEmitter<string>();

    public appState: AppState;

    public order = 'NONE';

    public destroy$ = new Subject<void>();

    constructor(
        private translationsStore: TranslationsStore,
        private appStateService: AppStateService) { }

    ngOnInit() {
        this.appStateService
            .listenToStateChange()
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => this.appState = state);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public changeTableOrder() {
        switch (this.order) {
            case 'ASC':
                this.order = 'DESC';
                break;
            case 'DESC':
                this.order = 'NONE';
                break;
            case 'NONE':
                this.order = 'ASC';
                break;
        }

        this.translationsStore
            .saveDefaultTableOrder(this.order);
    }

    public getOrderIcon(): string {
        switch (this.order) {
            case 'ASC':
                return 'fas fa-arrow-up';
            case 'DESC':
                return 'fas fa-arrow-down';
            case 'NONE':
                return 'fas fa-equals';
        }
    }

    public onEditExpression(expression: Expression) {
        this.edit.emit(expression);
    }

    public onDeleteExpression(expression: Expression) {
        this.delete.emit(expression);
    }

    public onShowDetails(expression: Expression) {
        this.showDetails.emit(expression);
    }

    public onChangeTableOrder() {
        this.changeOrdering.emit(this.order);
    }

    public getTableWidth(): string {
        return `${(this.selectedLanguages.length + 1) * 300 + 220}px`;
    }

    public haveTranslation(expression: Expression, language: Language): boolean {
        return expression.translations
            .some(translation => (translation.language.abbreviation === language.abbreviation));
    }

    public havePlural(expression: Expression, language: Language): boolean {
        return expression.translations
            .some(translation => (translation.language.abbreviation === language.abbreviation && !!translation.plural));
    }

    public getSingular(expression: Expression, language: Language): string {
        return expression.translations
            .find(translation => translation.language.abbreviation === language.abbreviation).value;
    }

    public getPlural(expression: Expression, language: Language): string {
        return expression.translations
            .find(translation => translation.language.abbreviation === language.abbreviation).plural;
    }

    public isAppOnline(): boolean {
        return this.appState === AppState.ONLINE;
    }

    public isAppOffline(): boolean {
        return this.appState === AppState.OFFLINE;
    }

    public isAppWithInvalidToken(): boolean {
        return this.appState === AppState.INVALID_TOKEN;
    }
}