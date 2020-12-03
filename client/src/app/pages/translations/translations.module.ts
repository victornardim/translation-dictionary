import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslationsComponent } from './translations.component';
import { ExpressionsFormModalComponent } from './component/expressions-form/expressions-form.component';
import { ExpressionsTableComponent } from './component/expressions-table/expressions-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpressionsService } from 'src/app/services/expressions.service';
import { TranslationsStore } from 'src/app/store/translations.store';
import { ExpressionsFormService } from './component/expressions-form/expressions-form.service';
import { TranslationsService } from './translations.service';
import { LoadingBarModule } from 'src/app/shared/components/loading-bar/loading-bar.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgbButtonsModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilModule } from 'src/app/util/util.module';
import { ExpressionDetailsComponent } from './component/expression-details/expression-details.component';

@NgModule({
    declarations: [
        TranslationsComponent,
        ExpressionsTableComponent,
        ExpressionsFormModalComponent,
        ExpressionDetailsComponent
    ],
    exports: [
        TranslationsComponent,
        ExpressionsTableComponent,
        ExpressionsFormModalComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingBarModule,
        NgSelectModule,
        NgOptionHighlightModule,
        NgbPaginationModule,
        NgbButtonsModule,
        UtilModule
    ],
    providers: [
        ExpressionsService,
        TranslationsStore,
        ExpressionsFormService,
        TranslationsService
    ]
})
export class TranslationsModule { }
