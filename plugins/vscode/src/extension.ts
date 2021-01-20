import * as vscode from 'vscode';
import { SettingsService } from './components/settings/settings.service';
import { PickerController } from './components/picker/picker.controller';

let settingsService: SettingsService;
let pickerController: PickerController;

let debuggerOutput = vscode.window.createOutputChannel('Translation dictionary (Debugger)');

export function activate(context: vscode.ExtensionContext) {
	process.on('uncaughtException', (error: Error) => {
		vscode.window.showErrorMessage(error.message);
		console.log(error);
	});

	init();

	vscode.commands.registerCommand('vscode.openSettingsFile', async () => {
		openSettingsFile();
	});

	vscode.commands.registerCommand('vscode.searchExpression', async () => {
		try {
			await pickerController.createPicker(getWord(), (selection: string) => {
				insertExpression(selection);
			});
		} catch (ex) {
			vscode.window.showErrorMessage(ex.message);
		}
	});
}

async function init() {
	try {
		settingsService = new SettingsService();
		await settingsService.init();

		pickerController = new PickerController();
		pickerController.init(settingsService.getSettings());
	} catch (ex) {
		vscode.window.showErrorMessage(ex.message);
	}
}

async function openSettingsFile() {
	vscode.workspace.openTextDocument(settingsService.getUri())
		.then((doc: vscode.TextDocument) => {
			vscode.window.showTextDocument(doc, 1, false);
		});
}

function getWord() {
	const editor = vscode.window.activeTextEditor;

	if (!!editor) {
		const document = editor.document;
		const selection = editor.selections[0];
		const range = selection.isEmpty ? document.getWordRangeAtPosition(selection.start) || selection : selection;

		return document.getText(range);
	}

	return '';
}

function insertExpression(word: string) {
	let wordToInsert = word;
	const editor = vscode.window.activeTextEditor;

	if (!!editor) {
		const settings = settingsService.getSettings();

		const document = editor.document;
		editor.edit(editBuilder => {
			const selection = editor.selections[0];
			const range = selection.isEmpty ? document.getWordRangeAtPosition(selection.start) || selection : selection;

			if (settings.expressionsToLowerCase) {
				wordToInsert = wordToInsert.toLowerCase();
			}

			if (settings.trimSpaces) {
				wordToInsert = trimSpaces(wordToInsert);
			}

			if (settings.removeAccents) {
				wordToInsert = removeAccents(wordToInsert);
			}

			editBuilder.replace(range, wordToInsert);
		})
	}
}

function trimSpaces(wordToTrim: string): string {
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

function removeAccents(word: string) {
	return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function deactivate() { }
