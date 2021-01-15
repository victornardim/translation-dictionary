import * as vscode from 'vscode';
import { Expression } from './model/expression';
import { ExtensionService } from './service/extension.service';
import { SettingsService } from './service/settings.service';

let settingsService: SettingsService;
let extensionService: ExtensionService;

let debuggerOutput = vscode.window.createOutputChannel('Translation dictionary (Debugger)');

export function activate(context: vscode.ExtensionContext) {
	init();

	vscode.commands.registerCommand('vscode.openSettingsFile', async () => {
		openSettingsFile();
	});

	vscode.commands.registerCommand('vscode.searchExpression', async () => {
		try {
			await searchExpression();
		} catch (ex) {
			vscode.window.showErrorMessage(ex);
		}
	});
}

async function init() {
	try {
		settingsService = new SettingsService();
		await settingsService.init();

		extensionService = new ExtensionService();
		await extensionService.init(settingsService.getSettings());
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

async function searchExpression() {
	const pick = vscode.window.createQuickPick();

	pick.items = await getPickOptions(getWord());

	pick.onDidChangeSelection(selection => {
		if (!!selection[0].label) {
			insertExpression(String(selection[0].label));
			pick.dispose();
		}
	});

	pick.onDidHide(() => pick.dispose());
	pick.show();
}

async function getPickOptions(filter: string): Promise<vscode.QuickPickItem[]> {
	const expressions = await extensionService.getExpressions(filter);

	return expressions.map((expression: Expression) => {
		return {
			label: expression.value,
			description: getPickOptionDescription(expression)
		};
	});
}

function getPickOptionDescription(expression: Expression): string {
	const settings = settingsService.getSettings();

	if (!settings.wordDescriptionTemplate) {
		let description = `${expression.type.toLowerCase()} `;

		if (expression.type === 'TRANSLATION') {
			description += `of "${expression.original}" `
		}

		description += `in ${expression.language} `;

		if (!!expression.isPlural) {
			description += 'in the plural';
		}

		return description;
	}

	return settings.wordDescriptionTemplate
		.replace(/%V/g, expression.value)
		.replace(/%P/g, expression.isPlural ? 'plural' : '')
		.replace(/%O/g, expression.original)
		.replace(/%L/g, expression.language)
		.replace(/%T/g, expression.type)
		.replace(/%t/g, expression.type.toLowerCase())
		.replace(/\s{2,}/g, ' ');
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
	const editor = vscode.window.activeTextEditor;

	if (!!editor) {
		const document = editor.document;
		editor.edit(editBuilder => {
			const selection = editor.selections[0];
			const range = selection.isEmpty ? document.getWordRangeAtPosition(selection.start) || selection : selection;
			editBuilder.replace(range, word);
		})
	}
}

export function deactivate() { }
