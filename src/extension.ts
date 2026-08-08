// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Context Lens activated');

	const disposable = vscode.commands.registerCommand(
		'context-lens.helloWorld',
		() => {
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			const activeEditor = vscode.window.activeTextEditor;

			const workspaceName = workspaceFolder?.name ?? 'No workspace';
			const activeFile = activeEditor?.document.fileName ?? 'No active file';

			vscode.window.showInformationMessage(
	`Workspace: ${vscode.workspace.workspaceFolders?.[0]?.name ?? 'No workspace'}`
);
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
