import * as vscode from 'vscode';
import { SettingsService } from './components/settings/settings.service';
import { PickerController } from './components/picker/picker.controller';
import { TextEditorController } from './components/text-editor/text-editor.controller';

let settingsService: SettingsService;
let pickerController: PickerController;
let textEditorController: TextEditorController;

let debuggerOutput = vscode.window.createOutputChannel('Translation dictionary (Debugger)');

export function activate(context: vscode.ExtensionContext) {
	handleErrors();
	init();

	vscode.commands.registerCommand('translation_dictionary.openSettingsFile', async () => {
		openSettingsFile();
	});

	vscode.commands.registerCommand('translation_dictionary.searchExpression', async () => {
		try {
			await pickerController.createPicker(textEditorController.getSelectedWord(), (selection: string) => {
				textEditorController.insertExpression(selection);
			});
		} catch (ex) {
			vscode.window.showErrorMessage(ex.message);
		}
	});
}

function handleErrors() {
	process.on('uncaughtException', (error: Error) => {
		vscode.window.showErrorMessage(error.message);
		console.log(error);
	});
}

async function init() {
	try {
		settingsService = new SettingsService();
		await settingsService.init();

		const settings = settingsService.getSettings();

		pickerController = new PickerController();
		await pickerController.init(settings);

		textEditorController = new TextEditorController();
		textEditorController.init(settings);
	} catch (ex) {
		vscode.window.showErrorMessage(ex.message);
	}
}

async function openSettingsFile() {
	vscode.workspace.openTextDocument(settingsService.getUri())
		.then((doc: vscode.TextDocument) => {
			vscode.window.showTextDocument(doc, 1, false);
		});

	vscode.workspace.onDidSaveTextDocument(async (doc: vscode.TextDocument) => {
		if (doc.fileName.includes('tdsettings.json')) {
			await init();
		}
	});
}

export function deactivate() { }
