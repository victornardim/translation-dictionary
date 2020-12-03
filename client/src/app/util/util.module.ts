import { NgModule } from '@angular/core';
import { DebounceDirective } from './debounce';

@NgModule({
    declarations: [
        DebounceDirective
    ],
    exports: [
        DebounceDirective
    ]
})
export class UtilModule { }
