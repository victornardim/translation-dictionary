import { Directive, ElementRef, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appDebounce]'
})
export class DebounceDirective {
    @Output() debounceCallback = new EventEmitter();
    @Input() debounceEvent = 'click';
    @Input() debounceDelay = 300;

    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        fromEvent(this.element.nativeElement, this.debounceEvent)
            .pipe(debounceTime(this.debounceDelay))
            .subscribe(() => this.debounceCallback.emit());
    }
}