import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, take, takeUntil, tap } from 'rxjs/operators';
import { Expression } from 'src/app/models/translations/expression';
import { Language } from 'src/app/models/translations/language';
import { AppStateService } from 'src/app/services/app-state.service';
import { ExpressionsService } from 'src/app/services/expressions.service';
import { AccessTokenService } from 'src/app/shared/components/access-token/access-token.service';
import { AlertService } from 'src/app/shared/components/alerts/alert.service';
import { ErrorCodes } from 'src/app/shared/error-codes.enum';
import { TranslationsStore } from 'src/app/store/translations.store';
import { ExpressionDetailsService } from './component/expression-details/expression-details.service';
import { ExpressionsFormService } from './component/expressions-form/expressions-form.service';
import { TranslationsService } from './translations.service';

@Component({
    selector: 'app-translations',
    templateUrl: './translations.component.html',
    styleUrls: ['./translations.component.css']
})
export class TranslationsComponent implements OnInit, OnDestroy {
    public expressions$: Observable<Expression[]>;
    private destroy$ = new Subject<void>();

    public languages: Language[];
    private originalExpressions: Expression[];

    public selectedLanguages: Language[] = [];

    public filterForm: FormGroup;

    public loading = true;
    public filtering = false;
    public editing = false;

    public expressionsCount = 0;
    public page = 1;
    public pageSize = 5;
    public order = 'NONE';

    public allowedPageSizes: any[] = [];

    public validToken = false;

    @ViewChild('newExpressionModal') newExpressionModal: NgbModal;
    @ViewChild('expressionDetailsModal') expressionDetailsModal: NgbModal;

    constructor(
        private expressionsService: ExpressionsService,
        private translationsStore: TranslationsStore,
        private expressionsFormService: ExpressionsFormService,
        private expressionDetailsService: ExpressionDetailsService,
        private accessTokenService: AccessTokenService,
        private translationsService: TranslationsService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.loadDefaultValues();
        this.initForm();
        this.disableApp();
        this.listenToCloseModal();
        this.lisenToAuthenticate();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public loadDefaultValues() {
        this.pageSize = this.translationsStore.getDefautPageSize();
        this.order = this.translationsStore.getDefaultTableOrder();
        this.allowedPageSizes = this.getAllowedPageSizes();
    }

    private getAllowedPageSizes(): any[] {
        return [
            {
                value: 5,
                description: '5 registros por página'
            },
            {
                value: 10,
                description: '10 registros por página'
            },
            {
                value: 20,
                description: '20 registros por página'
            }
        ];
    }

    private initForm() {
        this.filterForm = this.formBuilder.group({
            languages: [null],
            filter: [null],
            pageSize: [this.pageSize]
        });
    }

    private getSelectedLanguagesAbbreviation(): string[] {
        return this.selectedLanguages.map(language => language.abbreviation);
    }

    private listenToCloseModal() {
        this.translationsService
            .listenToCloseModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.modalService.dismissAll());
    }

    private disableApp() {
        this.disableFilterForm();
        this.expressions$ = of([]);
    }

    private disableFilterForm() {
        this.filterForm.controls.languages.disable();
        this.filterForm.controls.filter.disable();
        this.filterForm.controls.pageSize.disable();
    }

    private enableApp() {
        this.enableFilterForm();
    }

    private enableFilterForm() {
        this.filterForm.controls.languages.enable();
        this.filterForm.controls.filter.enable();
        this.filterForm.controls.pageSize.enable();
    }

    private lisenToAuthenticate() {
        this.accessTokenService
            .listenToAuthenticate()
            .pipe(takeUntil(this.destroy$))
            .subscribe(auth => {
                if (auth) {
                    this.validToken = true;
                    this.loadExpressions();
                    this.loadLanguages();
                } else {
                    this.validToken = false;
                    this.disableApp();
                }

                this.loading = false;
            });
    }

    private loadExpressions() {
        const filter = this.filterForm.controls.filter.value;

        this.expressions$ = this.expressionsService
            .get(this.page, this.pageSize, filter, this.order)
            .pipe(
                take(1),
                tap(expressions => {
                    this.originalExpressions = expressions.data;
                    this.expressionsCount = expressions.count;
                    this.enableApp();
                }),
                map(expressions => expressions.data),
                catchError(err => {
                    this.alertService.error(err.error.message);
                    this.disableFilterForm();
                    return of([]);
                })
            ) as Observable<Expression[]>;
    }

    private loadLanguages() {
        this.expressionsService
            .getLanguages()
            .pipe(take(1))
            .subscribe(data => {
                this.languages = data.languages;
                this.selectedLanguages = this.translationsStore.getDefaultLanguages();
                this.filterForm.controls.languages.setValue(this.getSelectedLanguagesAbbreviation());
            });
    }

    public changeLanguages(languages: Language[]) {
        this.selectedLanguages = [...languages];
        this.translationsStore.saveDefaultLanguages(languages);
    }

    public removeAllLanguages() {
        this.selectedLanguages = [];
        this.translationsStore.saveDefaultLanguages([]);
    }

    public filter() {
        const filter = this.filterForm.controls.filter.value;

        if (!filter) {
            if (!this.filtering) {
                return;
            } else {
                this.filtering = false;
            }
        } else {
            this.filtering = true;
        }

        this.loadExpressions();
    }

    public changePage(page: number) {
        this.page = page;
        this.loadExpressions();
    }

    public changePageSize() {
        this.pageSize = this.filterForm.controls.pageSize.value;
        this.page = 1;

        this.translationsStore.saveDefaultPageSize(this.pageSize);

        this.loadExpressions();
    }

    public openNewExpressionModal() {
        this.modalService.open(this.newExpressionModal, {
            beforeDismiss: () => {
                this.expressionsFormService.resetForm();
                this.editing = false;
                return true;
            },
            size: 'xl'

        });
    }

    public save(formData: any) {
        const expression = {
            id: formData.id,
            sourceLanguage: formData.sourceLanguage,
            value: formData.expression,
            description: formData.description,
            translations: formData.translations.map(translationData => {
                return {
                    id: translationData.id,
                    value: translationData.translation,
                    plural: translationData.plural,
                    language: translationData.language
                }
            })
        } as Expression;

        if (!this.editing) {
            this.createExpression(expression);
        } else {
            this.editExpression(expression);
        }
    }

    private createExpression(expression: Expression) {
        this.expressionsService
            .create(expression)
            .pipe(take(1))
            .subscribe(() => {
                this.loadExpressions();
                this.expressionsFormService.resetForm();
                this.alertService.success('Tradução salva com sucesso 😃');
            },
                (err) => {
                    this.alertService.error(this.getSaveError(err, expression.value));
                });
    }

    private editExpression(expression: Expression) {
        this.expressionsService
            .edit(expression)
            .pipe(take(1))
            .subscribe(() => {
                this.loadExpressions();
                this.expressionsFormService.resetForm();
                this.modalService.dismissAll();
                this.alertService.success('Tradução salva com sucesso 😃');
            },
                (err) => {
                    this.alertService.error(this.getSaveError(err, expression.value));
                });
    }

    private getSaveError(err, expression: string): string {
        if (err.error.code === ErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
            return `Eita! A expressão '${expression}' já existe 😭`;
        } else {
            return err.error.errors[0];
        }
    }

    public edit(expression: Expression) {
        this.editing = true;

        const originalExpression = this.originalExpressions
            .find(originalExpression => originalExpression.id == expression.id);

        this.openNewExpressionModal();

        setTimeout(() => {
            this.expressionsFormService
                .edit(originalExpression)
        });
    }

    public delete(expression: Expression) {
        if (confirm(`Deseja realmente excluir permanentemente a expressão '${expression.value}'?`)) {
            this.expressionsService
                .delete(expression.id)
                .pipe(take(1))
                .subscribe(() => {
                    this.loadExpressions()
                }, (err) => {
                    this.alertService.error(err.error.message);
                });
        }
    }

    public changeTableOrder(order: string) {
        this.order = order;

        this.translationsStore
            .saveDefaultTableOrder(this.order);

        this.loadExpressions();
    }

    public openDetailsModal(expression: Expression) {
        setTimeout(() => {
            this.expressionDetailsService
                .open(expression);
        });

        this.modalService.open(this.expressionDetailsModal, {
            size: 'md'
        });
    }
}