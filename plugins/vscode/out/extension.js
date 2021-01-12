"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const extension_service_1 = require("./service/extension.service");
const settings_service_1 = require("./service/settings.service");
let settingsService;
let extensionService;
let debuggerOutput = vscode.window.createOutputChannel('Translation dictionary (Debugger)');
function activate(context) {
    const disposable = vscode.commands.registerCommand('vscode.init', () => __awaiter(this, void 0, void 0, function* () {
        settingsService = new settings_service_1.SettingsService();
        yield settingsService.init();
        extensionService = new extension_service_1.ExtensionService();
        extensionService.init(settingsService);
        vscode.window.showInformationMessage('Welcome to the translation dictionary extension!');
    }));
    context.subscriptions.push(disposable);
    const searchMessage = vscode.commands.registerCommand('vscode.searchExpression', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield searchExpression();
        }
        catch (ex) {
            vscode.window.showErrorMessage(ex);
        }
    }));
    context.subscriptions.push(searchMessage);
    vscode.commands.registerCommand('vscode.openSettingsFile', () => __awaiter(this, void 0, void 0, function* () {
        vscode.workspace.openTextDocument(settingsService.getUri())
            .then((doc) => {
            vscode.window.showTextDocument(doc, 1, false);
        });
    }));
}
exports.activate = activate;
function searchExpression() {
    return __awaiter(this, void 0, void 0, function* () {
        const pick = vscode.window.createQuickPick();
        pick.items = yield getPickOptions(getWord());
        pick.onDidChangeSelection(selection => {
            if (!!selection[0].label) {
                insertExpression(String(selection[0].label));
                pick.dispose();
            }
        });
        pick.onDidHide(() => pick.dispose());
        pick.show();
    });
}
function getPickOptions(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const expressions = yield extensionService.getExpressions(filter);
        return expressions.map((item) => {
            return {
                "label": item.value,
                description: `(${item.type.toLowerCase()} - ${item.language}) ${item.isPlural ? '[plural]' : ''}`
            };
        });
    });
}
function getWord() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const selection = editor.selections[0];
        const range = selection.isEmpty ? document.getWordRangeAtPosition(selection.start) || selection : selection;
        return document.getText(range);
    }
    return '';
}
function insertExpression(word) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        editor.edit(editBuilder => {
            editor.selections.forEach(sel => {
                const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
                editBuilder.replace(range, word);
            });
        });
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map