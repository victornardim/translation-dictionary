import * as vscode from 'vscode';
import { ExtensionService } from './service/extension.service';
import { SettingsService } from './service/settings.service';

let settingsService: SettingsService;
let extensionService: ExtensionService;

let debuggerOutput = vscode.window.createOutputChannel('Translation dictionary (Debugger)');

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('vscode.init', async () => {
		settingsService = new SettingsService();
		await settingsService.init();

		extensionService = new ExtensionService();
		extensionService.init(settingsService);

		vscode.window.showInformationMessage('Welcome to the translation dictionary extension!');
	});

	context.subscriptions.push(disposable);

	const searchMessage = vscode.commands.registerCommand('vscode.searchExpression', async () => {
		try {
			await searchExpression();
		} catch (ex) {
			vscode.window.showErrorMessage(ex);
		}
	});

	context.subscriptions.push(searchMessage);

	vscode.commands.registerCommand('vscode.openSettingsFile', async () => {
		vscode.workspace.openTextDocument(settingsService.getUri())
			.then((doc: vscode.TextDocument) => {
				vscode.window.showTextDocument(doc, 1, false);
			});
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

	return expressions.map((item: any) => {
		return {
			"label": item.value,
			description: `(${item.type.toLowerCase()} - ${item.language}) ${item.isPlural ? '[plural]' : ''}`
		};
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

function insertExpression(word: string) {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const document = editor.document;
		editor.edit(editBuilder => {
			editor.selections.forEach(sel => {
				const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
				editBuilder.replace(range, word);
			})
		})
	}
}

export function deactivate() { }
