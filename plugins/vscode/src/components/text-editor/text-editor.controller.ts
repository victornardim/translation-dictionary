import * as vscode from 'vscode';
import { Settings } from '../../model/settings';

export class TextEditorController {
    private settings: Settings;

    constructor() {
        this.settings = <any>null;
    }

    public init(settings: Settings) {
        this.settings = settings;
    }

    public getSelectedWord(): string {
        const editor = this.getEditor();
        const document = editor.document;
        const selection = editor.selections[0];
        const range = selection.isEmpty ?
            document.getWordRangeAtPosition(selection.start) || selection :
            selection;

        return document.getText(range);
    }

    public insertExpression(word: string) {
        const editor = this.getEditor();
        const document = editor.document;

        editor.edit(editBuilder => {
            const selection = editor.selections[0];
            const range = selection.isEmpty ?
                document.getWordRangeAtPosition(selection.start) || selection :
                selection;

            editBuilder.replace(range, this.applyWordTransformations(word));
        });
    }

    private getEditor(): vscode.TextEditor {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            throw new Error('TRANSLATION_DICTIONARY: No active text editor');
        }

        return editor;
    }

    private applyWordTransformations(word: string): string {
        let transformed = word;

        if (this.settings.expression.toLowerCase) {
            transformed = transformed.toLowerCase();
        }

        if (this.settings.expression.trimSpaces) {
            transformed = this.trimSpaces(transformed);
        }

        if (this.settings.expression.removeAccents) {
            transformed = this.removeAccents(transformed);
        }

        return transformed;
    }

    private trimSpaces(wordToTrim: string): string {
        const words = wordToTrim.split(' ');

        if (words.length > 1) {
            return words.map((word, idx) => {
                if (idx === 0) {
                    return word.toLowerCase();
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
            }).join('');
        }

        return wordToTrim;
    }

    private removeAccents(word: string) {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}