import * as vscode from 'vscode';
import {
    ContextSnapshot,
    ContextState
} from '../context/types';
import { evaluateContext } from '../context/contextEvaluation';

export function observeWorkspace(): ContextState {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const activeEditor = vscode.window.activeTextEditor;

	const openFiles = vscode.window.tabGroups.all
		.flatMap(group => group.tabs)
		.filter(tab => tab.input instanceof vscode.TabInputText)
		.map(tab => {
			const input = tab.input as vscode.TabInputText;

			return {
				path: input.uri.fsPath,
				isActive: activeEditor?.document.uri.fsPath === input.uri.fsPath,
				isDirty: vscode.workspace.textDocuments.some(
					document =>
						document.uri.fsPath === input.uri.fsPath &&
						document.isDirty
				)
			};
		});

	if (!workspaceFolder) {
		const state: ContextState = {
			workspaceName: 'No workspace',
			workspacePath: '',
			activeFile: activeEditor?.document.fileName,
			projectState: {
				openFiles
			},
			facts: [],
			health: {
				overallStatus: 'unknown',
				findings: []
			}
		};

		const evaluation = evaluateContext(
			createContextSnapshot(state)
		);

		state.health = evaluation.health;

		return state;
	}

	const document = activeEditor?.document;

	const state: ContextState = {
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
		],
		health: {
			overallStatus: 'unknown',
			findings: []
		}
	};

	const evaluation = evaluateContext(
		createContextSnapshot(state)
	);

state.health = evaluation.health;

	return state;
}

export function createContextSnapshot(
    state: ContextState
): ContextSnapshot {
    return {
        workspaceName: state.workspaceName,
        workspacePath: state.workspacePath,
        facts: state.facts,
        projectState: state.projectState,
        observedAt: Date.now()
    };
}

export function observeActiveEditor(
	onChange: (state: ContextState) => void
): vscode.Disposable {

	return vscode.window.onDidChangeActiveTextEditor(() => {
		onChange(observeWorkspace());
	});
}

export function observeTabs(
	onChange: (state: ContextState) => void
): vscode.Disposable {

	return vscode.window.tabGroups.onDidChangeTabs(() => {
		onChange(observeWorkspace());
	});
}

export function observeDocumentChanges(
	onChange: (state: ContextState) => void
): vscode.Disposable {

	return vscode.workspace.onDidChangeTextDocument(() => {
		onChange(observeWorkspace());
	});
}
