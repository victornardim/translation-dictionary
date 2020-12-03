import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Alert } from '../alert.interface';
import { AlertType } from '../alert.enum';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
    @Input() alert: Alert;
    @Output() dismiss = new EventEmitter();

    private TIME_TO_DISMISS = 5000;
    private TIME_TO_CHANGE_CLASS = (this.TIME_TO_DISMISS - 500);

    private dismissTimer: any;
    private changeClassTimer: any;

    public class = 'slide-in';

    ngOnInit() {
        this.setTimer();
    }

    private setTimer() {
        this.dismissTimer = setTimeout(() => {
            this.dismiss.emit(this.alert);
        }, this.TIME_TO_DISMISS);

        this.changeClassTimer = setTimeout(() => {
            this.class = 'slide-out';
        }, this.TIME_TO_CHANGE_CLASS);
    }

    public close() {
        clearTimeout(this.dismissTimer);
        clearTimeout(this.changeClassTimer);
        this.dismiss.emit(this.alert);
    }

    public mouseIn() {
        clearTimeout(this.dismissTimer);
        clearTimeout(this.changeClassTimer);
    }

    public mouseOut() {
        this.setTimer();
    }

    public getTypeIcon(): string {
        switch (this.alert.type) {
            case AlertType.SUCCESS:
                return 'fas fa-check-circle';

            case AlertType.WARNING:
                return 'fas fa-exclamation-triangle';

            case AlertType.DANGER:
                return 'fas fa-times-circle';

            case AlertType.INFO:
                return 'fas fa-info-circle';

            default:
                return '';
        }
    }
}