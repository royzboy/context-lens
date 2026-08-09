import * as vscode from 'vscode';
import { ContextState } from '../context/types';

export function observeWorkspace(): ContextState {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const activeEditor = vscode.window.activeTextEditor;

	const openFiles = vscode.window.tabGroups.all
		.flatMap(group => group.tabs)
		.map(tab => {
			if (tab.input instanceof vscode.TabInputText) {
				return tab.input.uri.fsPath;
			}

			return undefined;
		})
		.filter((file): file is string => file !== undefined);

	const openEditors = vscode.window.tabGroups.all
	.flatMap(group => group.tabs)
	.filter(tab => tab.input instanceof vscode.TabInputText)
	.map(tab => {
		const input = tab.input as vscode.TabInputText;
		return vscode.workspace.asRelativePath(input.uri);
	})
	.join(', ') || 'None';

	console.log('Context Lens open editors:', openEditors);

	if (!workspaceFolder) {
		return {
			workspaceName: 'No workspace',
			workspacePath: '',
			activeFile: activeEditor?.document.fileName,
			projectState: {
				openFiles
			},
			facts: []
		};
	}

	const document = activeEditor?.document;

	return {
		workspaceName: workspaceFolder.name,
		workspacePath: workspaceFolder.uri.fsPath,
		activeFile: activeEditor?.document.fileName,
		projectState: {
			openFiles
		},
		facts: [
			{
				id: 'workspace',
				label: 'Workspace',
				value: workspaceFolder.name,
				status: 'observed',
				source: 'VS Code Workspace API',
				confidence: 'high'
			},
			{
				id: 'active-file',
				label: 'Active File',
				value: document?.fileName ?? 'None',
				status: 'observed',
				source: 'VS Code Text Editor API',
				confidence: 'high'
			},
			{
				id: 'open-editors',
				label: 'Open Editors',
				value: openEditors,
				status: 'observed',
				source: 'VS Code Tab Groups API',
				confidence: 'high'
			},
			{
				id: 'document-language',
				label: 'Language',
				value: document?.languageId ?? 'None',
				status: 'observed',
				source: 'VS Code Text Document API',
				confidence: 'high'
			},
			{
				id: 'document-dirty',
				label: 'Unsaved Changes',
				value: document?.isDirty ? 'Yes' : 'No',
				status: 'observed',
				source: 'VS Code Text Document API',
				confidence: 'high'
			}
		]
	};
}

export function observeActiveEditor(
	onChange: (state: ContextState) => void
): vscode.Disposable {
	console.log('Context Lens: registering active editor observer');

	return vscode.window.onDidChangeActiveTextEditor(() => {
		console.log('Context Lens: active editor changed');
		onChange(observeWorkspace());
	});
}

export function observeTabs(
	onChange: (state: ContextState) => void
): vscode.Disposable {
	console.log('Context Lens: registering tab observer');

	return vscode.window.tabGroups.onDidChangeTabs(() => {
		console.log('Context Lens: tabs changed');
		onChange(observeWorkspace());
	});
}

export function observeDocumentChanges(
	onChange: (state: ContextState) => void
): vscode.Disposable {
	console.log('Context Lens: registering document change observer');

	return vscode.workspace.onDidChangeTextDocument(() => {
		console.log('Context Lens: document changed');
		onChange(observeWorkspace());
	});
}
