import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { pairwise, startWith, takeUntil } from 'rxjs/operators';
import { Expression } from 'src/app/models/translations/expression';
import { Language } from 'src/app/models/translations/language';
import { Translation } from 'src/app/models/translations/translation';
import { justWhitespaceValidator } from 'src/app/shared/validators/just-whitespace.validator';
import { TranslationsService } from '../../translations.service';
import { ExpressionsFormService } from './expressions-form.service';

@Component({
    selector: 'app-expressions-form-modal',
    templateUrl: './expressions-form.component.html',
    styleUrls: ['./expressions-form.component.css']
})
export class ExpressionsFormModalComponent implements OnInit, OnDestroy {
    @Input() isEditing: boolean;
    @Input() set languages(value: Language[]) {
        this.selectedLanguages = value;

        if (!!value) {
            this.selectLanguage(this.getBrowserDefaultLanguage());
        }
    };

    @Output() save = new EventEmitter<Expression>();

    @ViewChild('expressionInput') expressionInput: ElementRef<HTMLInputElement>;

    private destroy$ = new Subject<void>();

    public form: FormGroup;

    public selectedLanguages: any[];

    constructor(
        private formBuilder: FormBuilder,
        private expressionsFormService: ExpressionsFormService,
        private translationsService: TranslationsService) { }

    ngOnInit() {
        this.initForm();
        this.listenToFormEvents();
        this.listenToHavePluralChange();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm() {
        this.form = this.formBuilder.group({
            id: [null],
            expression: [null, [Validators.required, justWhitespaceValidator]],
            sourceLanguage: [this.getBrowserDefaultLanguage(), [Validators.required, justWhitespaceValidator]],
            description: [null],
            translations: this.formBuilder.array([this.getTranslationForm()]),
            keepInserting: [false, Validators.required]
        });
    }

    private getBrowserDefaultLanguage(): string {
        return navigator.language || 'pt-BR';
    }

    private listenToFormEvents() {
        this.expressionsFormService
            .listenToEdit()
            .pipe(takeUntil(this.destroy$))
            .subscribe(expression => {
                this.edit(expression);
            });

        this.expressionsFormService
            .listenToResetForm()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.resetForm();
            });
    }

    public changeLanguageSelect() {
        this.resetSelectedLanguages();

        this.getTranslationsFormArray().controls.forEach(translation => {
            const language = translation.value.language;
            if (!!language) {
                this.selectLanguage(language);
            }
        });

        this.selectedLanguages = [...this.selectedLanguages];
    }

    private resetSelectedLanguages() {
        this.selectedLanguages.forEach(language => language.disabled = false);

        const sourceLanguage = this.form.controls.sourceLanguage.value;

        if (!!sourceLanguage) {
            this.selectLanguage(sourceLanguage);
        }
    }

    private selectLanguage(language: string) {
        const foundLanguage = this.selectedLanguages
            .find(selectedLanguage => selectedLanguage.abbreviation === language);

        foundLanguage.disabled = true;
    }

    private listenToHavePluralChange() {
        this.form.controls.translations.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                startWith([]),
                pairwise()
            ).subscribe(([oldTranslations, newTranslations]) => {
                newTranslations.forEach((newTranslation, index) => {
                    let oldTranslation = null;

                    if (!!oldTranslations) {
                        oldTranslation = oldTranslations[index];
                    }

                    if (!oldTranslation || newTranslation.havePlural !== oldTranslation.havePlural) {
                        this.updatePluralRequiredness(index, newTranslation.havePlural);
                    }
                });
            });
    }

    private updatePluralRequiredness(index: number, havePlural: boolean) {
        const translations = this.getTranslationsFormArray();
        const plural = (translations.controls[index] as FormGroup)
            .controls.plural;

        if (havePlural) {
            plural.setValidators(
                [Validators.required, justWhitespaceValidator]);
        } else {
            plural.clearValidators();
        }

        plural.updateValueAndValidity({ emitEvent: false });
    }

    private edit(expression: Expression) {
        const newTranslations = this.getTranslationsFormArray();
        newTranslations.removeAt(0);

        if (!!expression.id) {
            this.form.controls.id.setValue(expression.id);
        }

        this.form.controls.expression.setValue(expression.value);
        this.form.controls.sourceLanguage.setValue(expression.sourceLanguage.abbreviation);
        this.form.controls.description.setValue(expression.description);

        const translations = this.getTranslationsFormArray();
        expression.translations.forEach(translation => {
            translations.push(this.getTranslationForm(translation));
        });
    }

    private resetForm() {
        this.form.controls.expression.reset();
        this.resetNewTranslations();
        this.resetSelectedLanguages();
    }

    private resetNewTranslations() {
        const newTranslations = this.getTranslationsFormArray();
        while (newTranslations.length) {
            newTranslations.removeAt(0);
        }

        newTranslations.push(this.getTranslationForm());
    }

    public createNewTranslation() {
        const translations = this.getTranslationsFormArray();
        translations.push(this.getTranslationForm());
    }

    private getTranslationForm(translation?: Translation): FormGroup {
        if (!translation) {
            return this.getNewTranslationForm();
        }

        return this.getFilledTranslationForm(translation);
    }

    private getNewTranslationForm(): FormGroup {
        return this.formBuilder.group({
            translation: [null, [Validators.required, justWhitespaceValidator]],
            language: [null, Validators.required],
            plural: [null],
            havePlural: [false]
        });
    }

    private getFilledTranslationForm(translation?: Translation): FormGroup {
        return this.formBuilder.group({
            id: [translation.id],
            translation: [translation.value, [Validators.required, justWhitespaceValidator]],
            language: [translation.language.abbreviation, Validators.required],
            plural: [translation.plural],
            havePlural: [(!!translation.plural)]
        });
    }

    public removeNewTranslation(index: number) {
        const translations = this.getTranslationsFormArray();
        translations.removeAt(index);
    }

    public getTranslationsFormArray() {
        return (this.form.controls.translations) as FormArray;
    }

    public onSave() {
        const formData = this.getFormData();
        this.save.emit(formData);

        if (!!this.form.controls.keepInserting.value) {
            this.expressionInput.nativeElement.focus();
        } else {
            this.closeModal();
        }
    }

    private getFormData(): any {
        return this.clearUnselectedPlural(this.form.getRawValue());
    }

    private clearUnselectedPlural(formData: any): any {
        formData.translations
            .forEach(translation =>
                translation.plural = (!translation.havePlural) ? '' : translation.plural);

        return formData;
    }

    public closeModal() {
        this.translationsService.closeModal();
    }

    public translationHavePlural(index: number): boolean {
        const translations = this.getTranslationsFormArray();
        const havePlural = (translations.controls[index] as FormGroup)
            .controls.havePlural;

        return havePlural.value;
    }

    public getTranslationInputPlaceholder(index: number) {
        if (!this.translationHavePlural(index)) {
            return 'Digite aqui a tradução';
        }

        return 'Singular';
    }

    public getFormFieldClass(field: FormGroup, name: string): string {
        if (this.formFieldHaveErrors(field, name)) {
            return 'invalid-form-input';
        }

        return '';
    }

    public formFieldHaveErrors(field: FormGroup, name: string): boolean {
        return (field.get(name).errors && field.get(name).touched);
    }
}