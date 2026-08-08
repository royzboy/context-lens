import * as vscode from 'vscode';
import { ContextState } from '../context/types';

export function observeWorkspace(): ContextState {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const activeEditor = vscode.window.activeTextEditor;

	if (!workspaceFolder) {
		return {
			workspaceName: 'No workspace',
			workspacePath: '',
			activeFile: activeEditor?.document.fileName,
			facts: []
		};
	}

	return {
		workspaceName: workspaceFolder.name,
		workspacePath: workspaceFolder.uri.fsPath,
		activeFile: activeEditor?.document.fileName,
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
				value: activeEditor?.document.fileName ?? 'None',
				status: 'observed',
				source: 'VS Code Text Editor API',
				confidence: 'high'
			}
		]
	};
}