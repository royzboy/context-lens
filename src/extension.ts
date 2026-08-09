// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ContextPanelProvider } from './ui/contextPanel';
import {
	observeActiveEditor,
	observeDocumentChanges,
	observeTabs
} from './workspace/workspaceObserver';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Context Lens activated');

	const contextPanelProvider = new ContextPanelProvider();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			ContextPanelProvider.viewType,
			contextPanelProvider
		)
	);

	const disposable = vscode.commands.registerCommand(
		'context-lens.helloWorld',
		() => {
			vscode.window.showInformationMessage(
				`Workspace: ${
					vscode.workspace.workspaceFolders?.[0]?.name ?? 'No workspace'
				}`
			);
		}
	);

	context.subscriptions.push(disposable);

	const activeEditorSubscription = observeActiveEditor((state) => {
	console.log('Context Lens state updated:', state.activeFile);
	contextPanelProvider.updateState(state);
});

	context.subscriptions.push(activeEditorSubscription);

	const documentChangeSubscription = observeDocumentChanges((state) => {
	console.log('Context Lens state updated from document change:', state.activeFile);
	contextPanelProvider.updateState(state);
});

context.subscriptions.push(documentChangeSubscription);

const tabChangeSubscription = observeTabs((state) => {
    console.log(
        'Context Lens state updated from tab change:',
        state.activeFile
    );
    console.log(
        'Context Lens open files:',
        state.projectState.openFiles
    );
    contextPanelProvider.updateState(state);
});

context.subscriptions.push(tabChangeSubscription);
}



// This method is called when your extension is deactivated
export function deactivate() {}
