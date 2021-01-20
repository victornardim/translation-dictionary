import * as vscode from 'vscode';
import { Settings } from '../../model/settings';
import { PickerService } from './picker.service';

export class PickerController {
    private pickerService;

    constructor() {
        this.pickerService = new PickerService();
    }

    public init(settings: Settings) {
        this.pickerService.init(settings);
    }

    public async createPicker(filter: string, onSelect: Function) {
        const pick = vscode.window.createQuickPick();
        pick.items = await this.pickerService.getOptions(filter);

        pick.onDidChangeSelection(selection => {
            if (!!selection[0].label) {
                onSelect(String(selection[0].label));
                pick.dispose();
            }
        });

        pick.onDidHide(() => pick.dispose());
        pick.show();
    }
}